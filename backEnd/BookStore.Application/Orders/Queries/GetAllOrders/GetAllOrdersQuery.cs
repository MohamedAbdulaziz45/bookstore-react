using BookStore.Application.Orders.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Orders.Queries.GetAllOrders;

public class GetAllOrdersQuery : IRequest<IEnumerable<OrderDto>>
{
}
