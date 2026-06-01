using BookStore.Application.Common;
using BookStore.Application.Customers.Dtos;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Customers.Queries.GetAllCustomers;

internal class GetAllCustomersQueryHandler(
    ILogger<GetAllCustomersQueryHandler> logger,
    ICustomersRepository repository) : IRequestHandler<GetAllCustomersQuery, PagedResult<AdminCustomerDto>>
{
    public async Task<PagedResult<AdminCustomerDto>> Handle(GetAllCustomersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Customers");
        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;
        var search = request.SearchPhrase?.Trim().ToLowerInvariant();
        var query = (await repository.GetAllAsync()).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c =>
                (c.User!.DisplayName ?? string.Empty).ToLower().Contains(search) ||
                (c.User.Email ?? string.Empty).ToLower().Contains(search) ||
                (c.User.PhoneNumber ?? string.Empty).ToLower().Contains(search));
        }

        query = ApplySorting(query, request.SortBy, request.SortDirection);
        var totalCount = query.Count();
        var customers = query
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .Select(MapToDto)
            .ToList();

        return new PagedResult<AdminCustomerDto>(customers, totalCount, pageSize, pageNumber);
    }

    private static IQueryable<Customer> ApplySorting(IQueryable<Customer> query, string? sortBy, SortDirection direction)
    {
        var descending = direction == SortDirection.Descending;
        var normalized = sortBy?.Trim().ToLowerInvariant();

        return normalized switch
        {
            "displayname" or "name" => descending
                ? query.OrderByDescending(c => c.User!.DisplayName)
                : query.OrderBy(c => c.User!.DisplayName),
            "email" => descending
                ? query.OrderByDescending(c => c.User!.Email)
                : query.OrderBy(c => c.User!.Email),
            "orderscount" or "orders" => descending
                ? query.OrderByDescending(c => c.Orders.Count)
                : query.OrderBy(c => c.Orders.Count),
            "totalspent" => descending
                ? query.OrderByDescending(c => c.Orders.Sum(o => o.TotalAmount))
                : query.OrderBy(c => c.Orders.Sum(o => o.TotalAmount)),
            "membersince" => descending
                ? query.OrderByDescending(c => c.MemeberSince)
                : query.OrderBy(c => c.MemeberSince),
            _ => query.OrderByDescending(c => c.CustomerId)
        };
    }

    private static AdminCustomerDto MapToDto(Customer customer) => new()
    {
        CustomerId = customer.CustomerId,
        UserId = customer.UserId,
        DisplayName = customer.User?.DisplayName ?? customer.User?.Email ?? $"Customer #{customer.CustomerId}",
        Email = customer.User?.Email ?? string.Empty,
        Phone = customer.User?.PhoneNumber,
        ImagePath = customer.User?.ImagePath,
        MemberSince = customer.MemeberSince,
        OrdersCount = customer.Orders.Count,
        TotalSpent = customer.Orders.Sum(o => o.TotalAmount),
        IsDeleted = customer.IsDeleted
    };
}
