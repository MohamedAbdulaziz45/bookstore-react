using BookStore.Domain.Constants;
using MediatR;

namespace BookStore.Application.Orders.Commands.UpdateOrderStatus;

public class UpdateOrderStatusCommand : IRequest
{
    public int OrderId { get; set; }
    public OrderStatus NewStatus { get; set; }
}
