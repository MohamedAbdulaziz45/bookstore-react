

using BookStore.Application.Users.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Users.Queries.GetUserDetails;

public class GetUserDetailsQueryHandler(ILogger<GetUserDetailsQueryHandler> logger
, IUserContext userContext
, IUserStore<User> userStore)
: IRequestHandler<GetUserDetailsQuery,UserDetailsDto>
{
    public async Task<UserDetailsDto> Handle(GetUserDetailsQuery request, CancellationToken cancellationToken)
    {

        var user = userContext.GetCurrentUser();
        logger.LogInformation("Getting user details for: {UserId}", user!.Id);

        var dbUser = await userStore.FindByIdAsync(user!.Id, cancellationToken);
        if (dbUser == null)
        {
            throw new NotFoundException(nameof(User), user!.Id);
        }

        return new UserDetailsDto
        {
    
            Email = dbUser.Email!,
            DisplayName = dbUser.DisplayName,
            FirstName = dbUser.FirstName,
            LastName = dbUser.LastName,
            ImagePath = dbUser.ImagePath,
            Address = dbUser.Address,
            PhoneNumber = dbUser.PhoneNumber
        };
    }
}
