using MediatR;

namespace BookStore.Application.Addresses.Commands.SetDefaultAddress;

public class SetDefaultAddressCommand(int id) : IRequest<bool>
{
    public int AddressId { get; } = id;
}
