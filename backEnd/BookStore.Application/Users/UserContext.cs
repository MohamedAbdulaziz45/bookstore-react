using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace BookStore.Application.Users;

public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public CurrentUser? GetCurrentUser()
    {
        var user = httpContextAccessor?.HttpContext?.User
            ?? throw new InvalidOperationException("No active HTTP context");


        if (user.Identity == null || !user.Identity.IsAuthenticated)
        {
            return null;
        }

        var userId = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)!.Value;
        var email = user.FindFirst(c => c.Type == ClaimTypes.Email)!.Value;
        var roles = user.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

        var FirstName = user.FindFirst(c => c.Type == "FirstName")?.Value;
        var LastName = user.FindFirst(c => c.Type == "LastName")?.Value;
        var ImagePath = user.FindFirst(c => c.Type == "ImagePath")?.Value;
        var Address = user.FindFirst(c => c.Type == "Address")?.Value;
        var PhoneNumber = user.FindFirst(c => c.Type == "PhoneNumber")?.Value;
        var DisplayName = user.FindFirst(c => c.Type == "DisplayName")?.Value;

        return new CurrentUser(userId, email, roles, DisplayName, FirstName,LastName,ImagePath,Address,PhoneNumber);
    }


}
