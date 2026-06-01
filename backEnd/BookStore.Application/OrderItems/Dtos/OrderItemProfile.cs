using AutoMapper;
using BookStore.Domain.Entities;


namespace BookStore.Application.OrderItems.Dtos;

public class OrderItemProfile : Profile
{
    public OrderItemProfile()
    {
        CreateMap<OrderItem, OrderItemDto>();

    }
}
