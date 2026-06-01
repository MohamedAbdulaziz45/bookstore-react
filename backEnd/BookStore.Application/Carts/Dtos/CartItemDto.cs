namespace BookStore.Application.Carts.Dtos;

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int BookId { get; set; }
    public string Title { get; set; } = default!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int QuantityInStock { get; set; }
    public string? ImageUrl { get; set; }
    public decimal LineTotal { get; set; }
}