using BookStore.Application.Admin.Dtos;
using MediatR;

namespace BookStore.Application.Admin.Queries.GetAdminDashboardSummary;

public class GetAdminDashboardSummaryQuery : IRequest<AdminDashboardSummaryDto>
{
}
