using BookStore.Application.Orders.Dtos;
using MediatR;

namespace BookStore.Application.Orders.Queries.GetOrderBySessionId;

public class GetOrderBySessionIdQuery(string sessionId) : IRequest<OrderDto>
{
    public string SessionId { get; } = sessionId;
}
