using MediatR;

namespace BookStore.Application.Addresses.Commands.DeleteAddress;

public class DeleteAddressCommand(int id) : IRequest<bool>
{
    public int AddressId { get; } = id;
}
