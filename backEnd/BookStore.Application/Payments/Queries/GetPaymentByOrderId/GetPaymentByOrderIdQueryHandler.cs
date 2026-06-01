using AutoMapper;
using BookStore.Application.Payments.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Payments.Queries.GetPaymentByOrderId;

internal class GetPaymentByOrderIdQueryHandler(
    ILogger<GetPaymentByOrderIdQueryHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository,
    IPaymentsRepository paymentsRepository) : IRequestHandler<GetPaymentByOrderIdQuery, PaymentDto>
{
    public async Task<PaymentDto> Handle(GetPaymentByOrderIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting Payment for Order {OrderId}", request.OrderId);

        var order = await ordersRepository.GetByIdAsync(request.OrderId)
            ?? throw new NotFoundException(nameof(Order), request.OrderId.ToString());

        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        if (!user.Roles.Contains(UserRoles.Admin))
        {
            var customer = await customersRepository.GetByUserIdAsync(user.Id)
                ?? throw new ForbidException();

            if (order.CustomerId != customer.CustomerId)
                throw new ForbidException();
        }

        var payment = await paymentsRepository.GetByOrderIdAsync(request.OrderId)
            ?? throw new NotFoundException(nameof(Payment), $"OrderId {request.OrderId}");

        return mapper.Map<PaymentDto>(payment);
    }
}
