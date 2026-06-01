using AutoMapper;
using BookStore.Application.Orders.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Queries.GetMyOrders;

internal class GetMyOrdersQueryHandler(
    ILogger<GetMyOrdersQueryHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository) : IRequestHandler<GetMyOrdersQuery, IEnumerable<OrderDto>>
{
    public async Task<IEnumerable<OrderDto>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        logger.LogInformation("Getting orders for Customer {CustomerId}", customer.CustomerId);

        var entities = await ordersRepository.GetByCustomerIdAsync(customer.CustomerId);
        return mapper.Map<IEnumerable<OrderDto>>(entities);
    }
}
