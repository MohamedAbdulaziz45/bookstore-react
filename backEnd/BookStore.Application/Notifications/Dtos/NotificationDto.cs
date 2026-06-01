namespace BookStore.Application.Notifications.Dtos;

public class NotificationDto
{
    public int NotificationId { get; set; }
    public string Title { get; set; } = default!;
    public string Message { get; set; } = default!;
    public string Type { get; set; } = default!;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? LinkUrl { get; set; }
}

