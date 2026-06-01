using BookStore.Application.Addresses.Dtos;
using MediatR;

namespace BookStore.Application.Addresses.Queries.GetMyAddresses;

public class GetMyAddressesQuery: IRequest<IEnumerable<AddressDto>>
{
}
