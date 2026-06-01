using BookStore.Application.Admin.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Admin.Queries.GetAdminDashboardSummary;

internal class GetAdminDashboardSummaryQueryHandler(
    ILogger<GetAdminDashboardSummaryQueryHandler> logger,
    IBooksRepository booksRepository,
    IOrdersRepository ordersRepository,
    ICustomersRepository customersRepository,
    IPaymentsRepository paymentsRepository) : IRequestHandler<GetAdminDashboardSummaryQuery, AdminDashboardSummaryDto>
{
    public async Task<AdminDashboardSummaryDto> Handle(GetAdminDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting admin dashboard summary");

        var books = (await booksRepository.GetAllAsync()).ToList();
        var orders = (await ordersRepository.GetAllAsync()).ToList();
        var customers = (await customersRepository.GetAllAsync()).ToList();
        var payments = (await paymentsRepository.GetAllAsync()).ToList();

        return new AdminDashboardSummaryDto
        {
            TotalRevenue = payments.Sum(p => p.Amount),
            TotalOrders = orders.Count,
            TotalCustomers = customers.Count(c => !c.IsDeleted),
            TotalBooks = books.Count,
            RecentOrders = orders
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new AdminRecentOrderDto
                {
                    OrderId = o.OrderId,
                    Customer = o.Customer?.User?.DisplayName
                        ?? o.Customer?.User?.Email
                        ?? $"Customer #{o.CustomerId}",
                    ItemsCount = o.OrderItems.Sum(i => i.Quantity),
                    Amount = o.TotalAmount,
                    Status = o.Status.ToString(),
                    OrderDate = o.OrderDate
                })
                .ToList(),
            TopSellingBooks = books
                .Select(b => new AdminTopSellingBookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author.Name,
                    Sold = b.OrderItems.Sum(i => i.Quantity)
                })
                .Where(b => b.Sold > 0)
                .OrderByDescending(b => b.Sold)
                .Take(5)
                .ToList(),
            OrderStatusBreakdown = orders
                .GroupBy(o => o.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count()),
            LowStockBooks = books
                .Where(b => b.QuantityInStock <= 5)
                .OrderBy(b => b.QuantityInStock)
                .Take(8)
                .Select(b => new AdminLowStockBookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author.Name,
                    Stock = b.QuantityInStock
                })
                .ToList()
        };
    }
}
