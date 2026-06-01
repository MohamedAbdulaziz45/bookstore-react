using AutoMapper;
using BookStore.Application.Shippings.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Shippings.Queries.GetShippingById;

internal class GetShippingByIdQueryHandler(
ILogger<GetShippingByIdQueryHandler> logger,
IMapper mapper,
ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository,
IShippingsRepository repository,
IUserContext userContext) : IRequestHandler<GetShippingByIdQuery, ShippingDto>
{
    public async Task<ShippingDto> Handle(GetShippingByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Shipping {request.ShippingId}");
        var entity = await repository.GetByIdAsync(request.ShippingId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Shipping), request.ShippingId.ToString());

        var user = userContext.GetCurrentUser()
           ?? throw new ForbidException();

        if (!user.Roles.Contains(UserRoles.Admin))
        {
           var customer = await customersRepository.GetByUserIdAsync(user.Id)
             ?? throw new ForbidException();

            var order = await ordersRepository.GetByIdAsync(entity.OrderId)
            ?? throw new ForbidException();


            if (order.CustomerId != customer.CustomerId)
                throw new ForbidException();
        }
        return mapper.Map<ShippingDto>(entity);
    }
}
