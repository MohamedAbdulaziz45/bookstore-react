namespace BookStore.Application.Customers.Dtos;

public class AdminCustomerDto
{
    public int CustomerId { get; set; }
    public string UserId { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? Phone { get; set; }
    public string? ImagePath { get; set; }
    public DateTime MemberSince { get; set; }
    public int OrdersCount { get; set; }
    public decimal TotalSpent { get; set; }
    public bool IsDeleted { get; set; }
}
