using BookStore.Application.Common;
using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Users.Commands.UpdateUserDetails;

public class UpdateUserDetailsCommandHandler(
ILogger<UpdateUserDetailsCommandHandler> logger
, IUserContext userContext
, IUserStore<User> userStore
, ICloudinaryService cloudinary)
: IRequestHandler<UpdateUserDetailsCommand>
{
    public async Task Handle(UpdateUserDetailsCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();
        logger.LogInformation("Updating user: {UserId}, with {@Request}", user!.Id, request);

        var dbUser = await userStore.FindByIdAsync(user!.Id, cancellationToken);

        if (dbUser == null)
        {
            throw new NotFoundException(nameof(User), user!.Id);
        }

        if (request.PhoneNumber != null) dbUser.PhoneNumber = request.PhoneNumber;
        if (request.DisplayName != null) dbUser.DisplayName = request.DisplayName;
        if (request.FirstName != null) dbUser.FirstName = request.FirstName;
        if (request.LastName != null) dbUser.LastName = request.LastName;
        if (request.Address != null) dbUser.Address = request.Address;
        string? oldPublicId = dbUser.PublicId;
        CloudinaryUploadResult? uploadResult = null;

        try
        {
            if(request.Image !=null)
            {
                uploadResult = await cloudinary.UploadImageAsync(request.Image);
                dbUser.ImagePath = uploadResult.Url;
                dbUser.PublicId = uploadResult.PublicId;
            }

            var result = await userStore.UpdateAsync(dbUser, cancellationToken);

            if (!result.Succeeded)
            {
                if(uploadResult != null)
                {
                    await cloudinary.DeleteImageAsync(uploadResult.PublicId);
                }
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to update user: {errors}");        
           }

           if(uploadResult != null && !string.IsNullOrEmpty(oldPublicId))
           {
               try
                {
                    await cloudinary.DeleteImageAsync(oldPublicId);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to delete old image for user {UserId}", user!.Id);
                }
           }
        }
        catch(Exception ex)
        {
                  logger.LogError(ex, "Update failed for user {UserId}", user.Id);
        throw;
        }
    
    }
}
