using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;

namespace BookStore.Application.Notifications.Commands.MarkAllNotificationsAsRead;

internal class MarkAllNotificationsAsReadCommandHandler(
    IUserContext userContext,
    ICustomersRepository customersRepository,
    INotificationsRepository notificationsRepository) : IRequestHandler<MarkAllNotificationsAsReadCommand>
{
    public async Task Handle(MarkAllNotificationsAsReadCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();
        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        await notificationsRepository.MarkAllAsReadAsync(customer.CustomerId);
    }
}

