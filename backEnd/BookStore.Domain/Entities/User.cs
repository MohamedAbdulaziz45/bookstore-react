using Microsoft.AspNetCore.Identity;

namespace BookStore.Domain.Entities;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }   
    public string? FirstName { get; set; }
    public string? LastName { get; set; } 
    public string? Address { get; set; } 
    public string? ImagePath { get; set; }
    public string? PublicId { get; set; }
    //public int? PersonId { get; set; }
    //public Person? Person { get; set; }
    public Customer? Customer { get; set; }
}
