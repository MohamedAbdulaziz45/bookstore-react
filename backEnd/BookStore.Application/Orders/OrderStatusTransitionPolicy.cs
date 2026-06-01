using BookStore.Domain.Constants;
using BookStore.Domain.Entities;

namespace BookStore.Application.Orders;

public static class OrderStatusTransitionPolicy
{
    public static bool CanAdminTransition(OrderStatus from, OrderStatus to)
    {
        return from switch
        {
            OrderStatus.Pending => to is OrderStatus.Processing or OrderStatus.Cancelled,
            OrderStatus.Processing => to is OrderStatus.Shipped or OrderStatus.Cancelled,
            OrderStatus.Shipped => to == OrderStatus.Delivered,
            _ => false
        };
    }

    public static bool CanCustomerCancel(OrderStatus status)
    {
        return status == OrderStatus.Pending;
    }

    public static bool HasRequiredShippingInfo(Order order)
    {
        return order.Shipping is not null
            && !string.IsNullOrWhiteSpace(order.Shipping.CarrierName)
            && !string.IsNullOrWhiteSpace(order.Shipping.TrackingNumber)
            && order.Shipping.ShippingStatus != ShippingStatus.Pending;
    }
}
