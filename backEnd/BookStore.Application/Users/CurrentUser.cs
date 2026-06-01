namespace BookStore.Application.Users;

public record CurrentUser(string Id, string Email, IEnumerable<string> Roles,
string? DisplayName, string? FirstName,string? LastName,string?ImagePath
,string? Address,string?PhoneNumber);
