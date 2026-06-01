using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Queries.GetMyOrderSummary;

internal class GetMyOrderSummaryQueryHandler(
    ILogger<GetMyOrderSummaryQueryHandler> logger,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository) : IRequestHandler<GetMyOrderSummaryQuery, MyOrderSummaryDto>
{
    public async Task<MyOrderSummaryDto> Handle(GetMyOrderSummaryQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        logger.LogInformation("Getting order summary for Customer {CustomerId}", customer.CustomerId);

        var orders = await ordersRepository.GetByCustomerIdAsync(customer.CustomerId);
        var list = orders.ToList();

        return new MyOrderSummaryDto
        {
            TotalOrders = list.Count,
            TotalSpent = list.Sum(o => o.TotalAmount)
        };
    }
}

