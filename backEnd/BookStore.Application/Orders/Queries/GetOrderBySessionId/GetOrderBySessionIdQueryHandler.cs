using AutoMapper;
using BookStore.Application.Orders.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Queries.GetOrderBySessionId;

internal class GetOrderBySessionIdQueryHandler(
    ILogger<GetOrderBySessionIdQueryHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository) : IRequestHandler<GetOrderBySessionIdQuery, OrderDto>
{
    public async Task<OrderDto> Handle(GetOrderBySessionIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting order by Stripe session {SessionId}", request.SessionId);

        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        var order = await ordersRepository.GetByStripeSessionIdAsync(request.SessionId)
            ?? throw new NotFoundException(nameof(Order), request.SessionId);

        if (order.CustomerId != customer.CustomerId)
            throw new ForbidException();

        return mapper.Map<OrderDto>(order);
    }
}
