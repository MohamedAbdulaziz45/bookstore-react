using BookStore.Domain.Constants;

namespace BookStore.Application.Shippings.Dtos;

public class ShippingDto
{
    public int ShippingId { get; set; } = default;
    public string CarrierName { get; set; } = default!;
    public string TrackingNumber { get; set; } = default!;
    public ShippingStatus ShippingStatus { get; set; } = default!;
    public DateTime EstimatedDeliveryDate { get; set; } = default;
    public DateTime? ActualDeliveryDate { get; set; } = default;
    public int OrderId { get; set; } = default;
}
