using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;

namespace BookStore.Application.Notifications.Queries.GetMyUnreadNotificationsCount;

internal class GetMyUnreadNotificationsCountQueryHandler(
    IUserContext userContext,
    ICustomersRepository customersRepository,
    INotificationsRepository notificationsRepository) : IRequestHandler<GetMyUnreadNotificationsCountQuery, int>
{
    public async Task<int> Handle(GetMyUnreadNotificationsCountQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();
        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        return await notificationsRepository.GetUnreadCountByCustomerIdAsync(customer.CustomerId);
    }
}

