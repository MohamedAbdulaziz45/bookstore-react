using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;

namespace BookStore.Application.Notifications.Commands.MarkNotificationAsRead;

internal class MarkNotificationAsReadCommandHandler(
    IUserContext userContext,
    ICustomersRepository customersRepository,
    INotificationsRepository notificationsRepository) : IRequestHandler<MarkNotificationAsReadCommand>
{
    public async Task Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();
        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        var notification = await notificationsRepository.GetByIdAsync(request.NotificationId)
            ?? throw new NotFoundException("Notification", request.NotificationId.ToString());

        if (notification.CustomerId != customer.CustomerId)
            throw new ForbidException();

        await notificationsRepository.MarkAsReadAsync(request.NotificationId);
    }
}

