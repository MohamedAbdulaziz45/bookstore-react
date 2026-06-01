using BookStore.Application.OrderItems.Dtos;
using BookStore.Application.Payments.Dtos;
using BookStore.Application.Shippings.Dtos;
using BookStore.Domain.Constants;

namespace BookStore.Application.Orders.Dtos;

public class OrderDto
{
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public string? StripeSessionId { get; set; }
    public string CustomerName { get; set; } = default!;
    public int ItemsCount { get; set; }

    public ShippingAddressDto ShippingAddress { get; set; } = new();

    public int CustomerId { get; set; }
    public IEnumerable<OrderItemDto> OrderItems { get; set; } = [];
    public PaymentDto? Payment { get; set; }
    public ShippingDto? Shipping { get; set; }
}
