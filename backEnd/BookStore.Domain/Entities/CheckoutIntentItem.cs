namespace BookStore.Domain.Entities;

public class CheckoutIntentItem
{
    public int CheckoutIntentItemId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string BookTitle { get; set; } = default!;

    public int BookId { get; set; }
    public Book? Book { get; set; }

    public int CheckoutIntentId { get; set; }
    public CheckoutIntent? CheckoutIntent { get; set; }
}
