using MediatR;

namespace BookStore.Application.Orders.Queries.GetMyOrderSummary;

public class GetMyOrderSummaryQuery : IRequest<MyOrderSummaryDto>
{
}

