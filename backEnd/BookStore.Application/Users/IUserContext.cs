namespace BookStore.Application.Users;

public interface IUserContext
{
    CurrentUser? GetCurrentUser();

}
