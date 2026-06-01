using BookStore.Application.Payments.Dtos;
using MediatR;

namespace BookStore.Application.Payments.Queries.GetPaymentByOrderId;

public class GetPaymentByOrderIdQuery(int orderId) : IRequest<PaymentDto>
{
    public int OrderId { get; } = orderId;
}
