

using BookStore.Application.Common.Interface;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;


namespace BookStore.Infrastructure.Identity.Authentication;

public class AuthService(
    UserManager<User> userManager,
    ITokenService tokenService,
    ICustomersRepository customerRepository
    ) : IAuthService
{
    public async Task<string> RegisterAsync(string email, string password,string displayName, CancellationToken cancellationToken)
    {

       
            var user = new User
            {
                UserName = email,
                Email = email,
                DisplayName = displayName
            };

            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"User registration failed: {errors}");
            }

            var roleResult = await userManager.AddToRoleAsync(user, UserRoles.User);
            if (!roleResult.Succeeded)
            {
                await userManager.DeleteAsync(user);
                var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Role assignment failed: {errors}");
            }
            var customer = new Customer
            {
                UserId = user.Id,
                MemeberSince = DateTime.UtcNow
            };

        try
        {
            await customerRepository.CreateAsync(customer);
        }
        catch
        {
            await userManager.DeleteAsync(user); // compensate
            throw;

        }
        return await tokenService.GenerateToken(user);
    }

    public async Task<string> LoginAsync(string email, string password, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(email)
            ?? throw new InvalidOperationException("Invalid email or password");

        var isValidPassword = await userManager.CheckPasswordAsync(user, password);
        if (!isValidPassword)
        {
            throw new InvalidOperationException("Invalid email or password");
        }

        var customer = await customerRepository.GetByUserIdAsync(user.Id);
        if (customer?.IsDeleted == true)
        {
            throw new InvalidOperationException("This customer account has been deactivated.");
        }

        return await tokenService.GenerateToken(user);
    }
}
