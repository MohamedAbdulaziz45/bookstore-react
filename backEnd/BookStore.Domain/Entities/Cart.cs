

namespace BookStore.Domain.Entities;

public class Cart

{
    public int CartId { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

}
