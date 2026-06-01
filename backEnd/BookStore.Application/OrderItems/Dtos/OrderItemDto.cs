namespace BookStore.Application.OrderItems.Dtos;

public class OrderItemDto
{
    public int OrderItemId { get; set; } = default;
    public int Quantity { get; set; } = default;
    public decimal Price { get; set; } = default;
    public decimal TotalItemsPrice { get; set; } = default;
    public int BookId { get; set; } = default;
    public int OrderId { get; set; } = default;
}
