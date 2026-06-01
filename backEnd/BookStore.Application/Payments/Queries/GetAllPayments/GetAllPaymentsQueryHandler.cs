using BookStore.Application.Payments.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Payments.Queries.GetAllPayments;

internal class GetAllPaymentsQueryHandler(
    ILogger<GetAllPaymentsQueryHandler> logger,
    IPaymentsRepository paymentsRepository) : IRequestHandler<GetAllPaymentsQuery, IEnumerable<AdminPaymentDto>>
{
    public async Task<IEnumerable<AdminPaymentDto>> Handle(GetAllPaymentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all payments");

        var payments = await paymentsRepository.GetAllAsync();

        return payments.Select(payment => new AdminPaymentDto
        {
            PaymentId = payment.PaymentId,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            TransactionDate = payment.TransactionDate,
            StripePaymentIntentId = payment.StripePaymentIntentId,
            Currency = payment.Currency,
            OrderId = payment.OrderId,
            Customer = payment.Order?.Customer?.User?.DisplayName
                ?? payment.Order?.Customer?.User?.Email
                ?? $"Customer #{payment.Order?.CustomerId ?? 0}"
        }).ToList();
    }
}
