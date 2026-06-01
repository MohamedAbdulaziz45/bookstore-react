

using MediatR;

namespace BookStore.Application.Users.Commands.RegisterUser;

public class RegisterUserCommand :IRequest<string>
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
}
