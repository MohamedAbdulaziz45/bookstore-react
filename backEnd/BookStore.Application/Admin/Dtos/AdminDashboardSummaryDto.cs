namespace BookStore.Application.Admin.Dtos;

public class AdminDashboardSummaryDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalBooks { get; set; }
    public IEnumerable<AdminRecentOrderDto> RecentOrders { get; set; } = [];
    public IEnumerable<AdminTopSellingBookDto> TopSellingBooks { get; set; } = [];
    public IDictionary<string, int> OrderStatusBreakdown { get; set; } = new Dictionary<string, int>();
    public IEnumerable<AdminLowStockBookDto> LowStockBooks { get; set; } = [];
}

public class AdminRecentOrderDto
{
    public int OrderId { get; set; }
    public string Customer { get; set; } = default!;
    public int ItemsCount { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = default!;
    public DateTime OrderDate { get; set; }
}

public class AdminTopSellingBookDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = default!;
    public string Author { get; set; } = default!;
    public int Sold { get; set; }
}

public class AdminLowStockBookDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = default!;
    public string Author { get; set; } = default!;
    public int Stock { get; set; }
}
