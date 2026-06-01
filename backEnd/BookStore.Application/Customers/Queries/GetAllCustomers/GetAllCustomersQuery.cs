using BookStore.Application.Customers.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Constants;
using MediatR;

namespace BookStore.Application.Customers.Queries.GetAllCustomers;

public class GetAllCustomersQuery : IRequest<PagedResult<AdminCustomerDto>>
{
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public SortDirection SortDirection { get; set; } = SortDirection.Ascending;
}
