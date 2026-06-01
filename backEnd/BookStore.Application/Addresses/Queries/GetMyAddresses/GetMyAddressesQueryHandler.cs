using AutoMapper;
using BookStore.Application.Addresses.Dtos;
using BookStore.Application.Authors.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Addresses.Queries.GetMyAddresses;

internal class GetMyAddressesQueryHandler
(ILogger<GetMyAddressesQueryHandler> logger,
IUserContext userContext,
IMapper mapper,
IAddressesRepository addressesRepository,
ICustomersRepository customersRepository) : IRequestHandler<GetMyAddressesQuery, IEnumerable<AddressDto>>
{
    public async Task<IEnumerable<AddressDto>> Handle(GetMyAddressesQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();


        var customer = await customersRepository.GetByUserIdAsync(user!.Id);

        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        }
        logger.LogInformation($"getting all the addresses with customerId = {customer.CustomerId}");
        var addresses = await addressesRepository.GetByCustomerIdAsync(customer.CustomerId);
    
        
        return mapper.Map<IEnumerable<AddressDto>>(addresses);
    }
}
