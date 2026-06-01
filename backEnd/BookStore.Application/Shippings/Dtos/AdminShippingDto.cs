namespace BookStore.Application.Shippings.Dtos;

public class AdminShippingDto : ShippingDto
{
    public string Customer { get; set; } = default!;
}
