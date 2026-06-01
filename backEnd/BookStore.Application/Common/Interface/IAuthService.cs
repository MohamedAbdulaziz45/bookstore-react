

namespace BookStore.Application.Common.Interface;

public interface IAuthService
{

    Task<string> RegisterAsync(string email, string password,
    string displayName, CancellationToken cancellationToken);

    Task<string> LoginAsync(string email, string password, CancellationToken cancellationToken);
}
