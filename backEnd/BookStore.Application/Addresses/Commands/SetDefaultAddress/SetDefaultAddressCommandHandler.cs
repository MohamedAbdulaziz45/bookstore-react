using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Addresses.Commands.SetDefaultAddress;

internal class SetDefaultAddressCommandHandler(
    ILogger<SetDefaultAddressCommandHandler> logger,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IAddressesRepository addressesRepository)
    : IRequestHandler<SetDefaultAddressCommand, bool>
{
    public async Task<bool> Handle(SetDefaultAddressCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user!.Id);
        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        }

        logger.LogInformation("User {UserId} is setting address {AddressId} as default", user.Id, request.AddressId);

        var address = await addressesRepository.GetByIdAsync(request.AddressId);
        if (address == null || address.CustomerId != customer.CustomerId)
        {
            throw new NotFoundException(nameof(Address), request.AddressId.ToString());
        }

        var isUpdated = await addressesRepository.SetDefaultAsync(customer.CustomerId, request.AddressId);
        if (!isUpdated)
        {
            throw new NotFoundException(nameof(Address), request.AddressId.ToString());
        }

        return isUpdated;
    }
}
