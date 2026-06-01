using MediatR;
using Microsoft.AspNetCore.Http;

namespace BookStore.Application.Users.Commands.UpdateUserDetails;

public class UpdateUserDetailsCommand : IRequest
{
    public string? DisplayName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Image { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}
