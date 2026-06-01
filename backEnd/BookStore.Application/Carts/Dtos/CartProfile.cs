
using AutoMapper;
using BookStore.Domain.Entities;

namespace BookStore.Application.Carts.Dtos;

public class CartProfile : Profile
{
public CartProfile()
    {
        CreateMap<Cart, CartDto>()
        .ForMember(dest => dest.TotalItems,
        opt => opt.MapFrom(src => src.CartItems.Sum(i => i.Quantity)))
        .ForMember(dest => dest.Subtotal,
        opt => opt.MapFrom(src =>
        src.CartItems.Sum(i => i.Quantity * (i.Book != null ? i.Book.Price : 0m))))
        .ForMember(dest => dest.Items,
        opt => opt.MapFrom(src => src.CartItems));


        CreateMap<CartItem, CartItemDto>()
        .ForMember(dest => dest.Title,
        opt => opt.MapFrom(src => src.Book != null ? src.Book.Title : string.Empty))
        .ForMember(dest => dest.Price,
        opt => opt.MapFrom(src => src.Book != null ? src.Book.Price : 0m))
        .ForMember(dest => dest.QuantityInStock,
        opt => opt.MapFrom(src => src.Book != null ? src.Book.QuantityInStock : 0))
        .ForMember(dest => dest.ImageUrl,
        opt => opt.MapFrom(src =>
        src.Book != null ? src.Book.BookImage != null ? src.Book.BookImage.ImageURL : null : null))
        .ForMember(dest => dest.LineTotal,
        opt => opt.MapFrom(src => src.Quantity * (src.Book != null ? src.Book.Price : 0M)));
    }
}
