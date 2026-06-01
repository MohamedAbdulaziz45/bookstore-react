using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Application.Shippings.Commands.CreateShipping;
using BookStore.Application.Shippings.Commands.UpdateShipping;

namespace BookStore.Application.Shippings.Dtos;

public class ShippingProfile : Profile
{
    public ShippingProfile()
    {
        CreateMap<Shipping, ShippingDto>();
        CreateMap<CreateShippingCommand, Shipping>();
        CreateMap<UpdateShippingCommand, Shipping>();
    }
}
