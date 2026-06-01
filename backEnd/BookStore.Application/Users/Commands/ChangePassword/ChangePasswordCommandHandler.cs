using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Users.Commands.ChangePassword
{
    internal class ChangePasswordCommandHandler(
    ILogger<ChangePasswordCommandHandler> logger,
    IUserContext userContext,
    UserManager<User> userManager)
    : IRequestHandler<ChangePasswordCommand>
    {
        public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
            ?? throw new ForbidException();

            logger.LogInformation("Changing password for User {UserId}", currentUser.Id);

            var user = await userManager.FindByIdAsync(currentUser.Id)
                ?? throw new NotFoundException(nameof(User), currentUser.Id);

            var result = await userManager.ChangePasswordAsync(
                user,
                request.CurrentPassword,
                request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(error => error.Description));
                throw new BadRequestException(errors);
            }
        }
    }
}
