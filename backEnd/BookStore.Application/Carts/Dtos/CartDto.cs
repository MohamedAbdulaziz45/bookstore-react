namespace BookStore.Application.Carts.Dtos;

public class CartDto
{
    public int CartId { get; set; }
    public int CustomerId { get; set; }
    public int TotalItems { get; set; }
    public decimal Subtotal { get; set; }
    public List<CartItemDto> Items { get; set; } = new();

}
