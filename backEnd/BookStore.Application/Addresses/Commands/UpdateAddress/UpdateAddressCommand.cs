using MediatR;

namespace BookStore.Application.Addresses.Commands.UpdateAddress;

public class UpdateAddressCommand : IRequest<bool>
{
    public int AddressId { get; set; }
    public string Label { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = default!;
    public string? State { get; set; }
    public string PostalCode { get; set; } = default!;
    public string Country { get; set; } = default!;
    public bool IsDefault { get; set; }
}
