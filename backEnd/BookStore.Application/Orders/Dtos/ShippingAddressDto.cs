namespace BookStore.Application.Orders.Dtos;

public class ShippingAddressDto
{
    public string RecipientName { get; set; } = default!;
    public string RecipientPhone { get; set; } = default!;
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = default!;
    public string? State { get; set; }
    public string PostalCode { get; set; } = default!;
    public string Country { get; set; } = default!;
}
