
using BookStore.Domain.Entities;

namespace BookStore.Application.Common.Interface;

public interface ITokenService
{
     Task<string> GenerateToken(User user);
}
