using BookStore.Domain.Constants;
using MediatR;

namespace BookStore.Application.Shippings.Commands.CreateShipping;

public class CreateShippingCommand : IRequest<int>
{
    public string CarrierName { get; set; } = default!;
    public string TrackingNumber { get; set; } = default!;
    public ShippingStatus ShippingStatus { get; set; } = default!;
    public DateTime EstimatedDeliveryDate { get; set; } = default;
    public DateTime? ActualDeliveryDate { get; set; } = default;
    public int OrderId { get; set; } = default;
}
