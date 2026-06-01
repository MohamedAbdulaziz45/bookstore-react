
using MediatR;

namespace BookStore.Application.Users.Commands.LoginUser;

public class LoginUserCommand : IRequest<string>
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}
