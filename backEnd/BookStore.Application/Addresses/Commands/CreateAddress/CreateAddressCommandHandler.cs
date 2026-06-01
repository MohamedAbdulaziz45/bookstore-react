using AutoMapper;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Addresses.Commands.CreateAddress;

internal class CreateAddressCommandHandler(
    ILogger<CreateAddressCommandHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IAddressesRepository addressesRepository)
    : IRequestHandler<CreateAddressCommand, int>
{
    public async Task<int> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user!.Id);

        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        }

        logger.LogInformation("User {UserId} is creating an address", user.Id);

        var address = mapper.Map<Address>(request);
        address.CustomerId = customer.CustomerId;

        if (address.IsDefault)
        {
            var currentDefault = await addressesRepository.GetDefaultByCustomerIdAsync(customer.CustomerId);
            if (currentDefault != null)
            {
                currentDefault.IsDefault = false;
                await addressesRepository.UpdateAsync(currentDefault);
            }
        }

        var id = await addressesRepository.CreateAsync(address);

        return id;
    }
}
