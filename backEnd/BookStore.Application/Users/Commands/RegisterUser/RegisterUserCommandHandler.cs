
using BookStore.Application.Common.Interface;

using MediatR;

using Microsoft.Extensions.Logging;

namespace BookStore.Application.Users.Commands.RegisterUser;

public class RegisterUserCommandHandler(ILogger<RegisterUserCommandHandler> logger,
IAuthService authService)
: IRequestHandler<RegisterUserCommand,string>
{
    public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Registering new user with email: {Email}", request.Email);

        var token = await authService
        .RegisterAsync(request.Email, request.Password,request.DisplayName, cancellationToken);

        logger.LogInformation("User registered successfully");

        return token;
    }
}
