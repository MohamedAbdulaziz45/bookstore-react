
using BookStore.Application.Common.Interface;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Users.Commands.LoginUser;

public class LoginUserCommandHandler(ILogger<LoginUserCommandHandler> logger,
    IAuthService authService)
    : IRequestHandler<LoginUserCommand, string>
{
    public async Task<string> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Logging in user with email: {Email}", request.Email);

        var token = await authService.LoginAsync(request.Email, request.Password, cancellationToken);

        logger.LogInformation("User logged in successfully");

        return token;
    }
}
