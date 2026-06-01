namespace BookStore.Domain.Constants;

public enum ShippingStatus
{
    Pending = 0,
    InTransit = 1,
    OutForDelivery = 2,
    Delivered = 3,
    Failed = 4,
    Returned = 5
}