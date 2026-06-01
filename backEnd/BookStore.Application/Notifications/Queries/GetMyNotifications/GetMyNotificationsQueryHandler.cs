using AutoMapper;
using BookStore.Application.Notifications.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;

namespace BookStore.Application.Notifications.Queries.GetMyNotifications;

internal class GetMyNotificationsQueryHandler(
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    INotificationsRepository notificationsRepository) : IRequestHandler<GetMyNotificationsQuery, IEnumerable<NotificationDto>>
{
    public async Task<IEnumerable<NotificationDto>> Handle(GetMyNotificationsQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        var entities = await notificationsRepository.GetByCustomerIdAsync(customer.CustomerId);
        return mapper.Map<IEnumerable<NotificationDto>>(entities);
    }
}

