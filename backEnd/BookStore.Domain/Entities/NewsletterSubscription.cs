namespace BookStore.Domain.Entities;

public class NewsletterSubscription
{
    public int NewsletterSubscriptionId { get; set; }
    public string Email { get; set; } = default!;
    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UnsubscribedAt { get; set; }
}
