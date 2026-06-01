namespace BookStore.Application.Customers.Dtos;

public class CustomerDto
{
    public int CustomerId { get; set; } = default;
    public DateTime MemeberSince { get; set; } = default;
    public string UserId { get; set; } = default!;
    public bool IsDeleted { get; set; }
}
