namespace BookStore.Domain.Entities;

public class Address
{
    public int AddressId { get; set; }
    public string Label { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = default!;
    public string? State { get; set; }
    public string PostalCode { get; set; } = default!;
    public string Country { get; set; } = default!;
    public bool IsDefault { get; set; }

    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
}
