
using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Infrastructure.Identity;

public class TokenService(IConfiguration configuration, UserManager<User> userManager) : ITokenService
{
    public async Task<string> GenerateToken(User user)
    {
        {
            var secretKey = configuration["Authentication:SecretKey"] ?? throw new InvalidOperationException("SecretKey not configured");
            var issuer = configuration["Authentication:Issuer"];
            var audience = configuration["Authentication:Audience"];


            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
            var roles = await userManager.GetRolesAsync(user);
            foreach(var role in roles) 
              claims.Add(new Claim(ClaimTypes.Role, role));
             
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
