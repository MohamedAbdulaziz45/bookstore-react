using BookStore.Application.Notifications.Dtos;
using MediatR;

namespace BookStore.Application.Notifications.Queries.GetMyNotifications;

public class GetMyNotificationsQuery : IRequest<IEnumerable<NotificationDto>>
{
}

