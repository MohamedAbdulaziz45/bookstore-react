using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Addresses.Commands.DeleteAddress;

internal class DeleteAddressCommandHandler(
    ILogger<DeleteAddressCommandHandler> logger,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IAddressesRepository addressesRepository)
    : IRequestHandler<DeleteAddressCommand, bool>
{
    public async Task<bool> Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user!.Id);
        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        }

        logger.LogInformation("User {UserId} is deleting address {AddressId}", user.Id, request.AddressId);

        var address = await addressesRepository.GetByIdAsync(request.AddressId);
        if (address == null || address.CustomerId != customer.CustomerId)
        {
            throw new NotFoundException(nameof(Address), request.AddressId.ToString());
        }

        var isDeleted = await addressesRepository.DeleteAsync(request.AddressId);
        if (!isDeleted)
        {
            throw new NotFoundException(nameof(Address), request.AddressId.ToString());
        }

        return isDeleted;
    }
}
