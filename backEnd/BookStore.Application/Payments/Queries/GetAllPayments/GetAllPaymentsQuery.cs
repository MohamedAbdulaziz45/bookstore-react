using BookStore.Application.Payments.Dtos;
using MediatR;

namespace BookStore.Application.Payments.Queries.GetAllPayments;

public class GetAllPaymentsQuery : IRequest<IEnumerable<AdminPaymentDto>>
{
}
