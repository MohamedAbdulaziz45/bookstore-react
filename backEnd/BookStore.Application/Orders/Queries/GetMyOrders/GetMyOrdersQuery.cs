using BookStore.Application.Orders.Dtos;
using MediatR;

namespace BookStore.Application.Orders.Queries.GetMyOrders;

public class GetMyOrdersQuery : IRequest<IEnumerable<OrderDto>>
{
}
