using AutoMapper;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Addresses.Commands.UpdateAddress;

internal class UpdateAddressCommandHandler(
    ILogger<UpdateAddressCommandHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IAddressesRepository addressesRepository)
    : IRequestHandler<UpdateAddressCommand, bool>
{
    public async Task<bool> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user!.Id);
        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        }

        logger.LogInformation("User {UserId} is updating address {AddressId}", user.Id, request.AddressId);

        var address = await addressesRepository.GetByIdAsync(request.AddressId);
        if (address == null || address.CustomerId != customer.CustomerId)
        {
            throw new NotFoundException(nameof(Address), request.AddressId.ToString());
        }

        if (request.IsDefault== true && address.IsDefault == false)
        {
            await addressesRepository.SetDefaultAsync(customer.CustomerId, request.AddressId);
        }

        mapper.Map(request, address);
        address.CustomerId = customer.CustomerId;

        return await addressesRepository.UpdateAsync(address);
    }
}
