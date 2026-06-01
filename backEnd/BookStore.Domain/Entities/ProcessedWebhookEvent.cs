namespace BookStore.Domain.Entities;

public class ProcessedWebhookEvent
{
    public string EventId { get; set; } = default!;
    public string EventType { get; set; } = default!;
    public DateTime ProcessedAt { get; set; }
}
