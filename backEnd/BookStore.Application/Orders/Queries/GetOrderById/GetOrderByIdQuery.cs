using BookStore.Application.Orders.Dtos;
using MediatR;

namespace BookStore.Application.Orders.Queries.GetOrderById;

public class GetOrderByIdQuery(int id) : IRequest<OrderDto>
{
    public int OrderId { get; } = id;
}
