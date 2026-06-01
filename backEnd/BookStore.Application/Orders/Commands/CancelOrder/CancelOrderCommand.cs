using MediatR;

namespace BookStore.Application.Orders.Commands.CancelOrder;

public class CancelOrderCommand(int orderId) : IRequest
{
    public int OrderId { get; } = orderId;
}
