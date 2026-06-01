using AutoMapper;
using BookStore.Application.Addresses.Commands.CreateAddress;
using BookStore.Application.Addresses.Commands.UpdateAddress;
using BookStore.Domain.Entities;

namespace BookStore.Application.Addresses.Dtos;

public class AddressProfile : Profile
{
    public AddressProfile()
    {
        CreateMap<Address, AddressDto>();
        CreateMap<CreateAddressCommand, Address>();
        CreateMap<UpdateAddressCommand, Address>()
            .ForMember(d => d.AddressId, opt => opt.Ignore())
            .ForMember(d => d.IsDefault, opt => opt.Ignore()); ;
    }
}
