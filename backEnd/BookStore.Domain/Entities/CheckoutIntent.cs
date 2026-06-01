using BookStore.Domain.Constants;

namespace BookStore.Domain.Entities;

public class CheckoutIntent
{
    public int CheckoutIntentId { get; set; }
    public string? StripeSessionId { get; set; }
    public string? StripeCustomerId { get; set; }
    public CheckoutIntentStatus Status { get; set; } = CheckoutIntentStatus.Created;
    public DateTime CreatedAt { get; set; }
    public DateTime? FulfilledAt { get; set; }
    public string? FailureReason { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "egp";


    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public int? SavedAddressId { get; set; }
    public Address? SavedAddress { get; set; }

    public ShippingAddressSnapshot ShippingAddress { get; set; } = new();

    public ICollection<CheckoutIntentItem> Items { get; set; } = new List<CheckoutIntentItem>();


}
