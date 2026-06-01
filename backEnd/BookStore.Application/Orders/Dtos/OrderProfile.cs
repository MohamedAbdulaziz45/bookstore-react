using AutoMapper;
using BookStore.Domain.Entities;


namespace BookStore.Application.Orders.Dtos;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<ShippingAddressSnapshot, ShippingAddressDto>();
        CreateMap<Order, OrderDto>()
            .ForMember(d => d.CustomerName, o => o.MapFrom(s =>
                s.Customer != null && s.Customer.User != null
                    ? s.Customer.User.DisplayName ?? s.Customer.User.Email ?? $"Customer #{s.CustomerId}"
                    : $"Customer #{s.CustomerId}"))
            .ForMember(d => d.ItemsCount, o => o.MapFrom(s => s.OrderItems.Sum(i => i.Quantity)));

    }
}
