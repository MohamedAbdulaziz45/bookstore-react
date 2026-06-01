using MediatR;

namespace BookStore.Application.Notifications.Commands.MarkNotificationAsRead;

public class MarkNotificationAsReadCommand(int notificationId) : IRequest
{
    public int NotificationId { get; } = notificationId;
}

