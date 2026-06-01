using BookStore.Domain.Constants;
using System;

namespace BookStore.Domain.Entities;

public class Shipping
{
    public int ShippingId { get; set; }
    public string CarrierName { get; set; } = default!;
    public string TrackingNumber { get; set; } = default!;
    public ShippingStatus ShippingStatus { get; set; } = default!;
    public DateTime EstimatedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }
}
