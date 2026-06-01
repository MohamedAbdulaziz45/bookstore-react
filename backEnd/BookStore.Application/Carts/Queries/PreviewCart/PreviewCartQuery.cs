
using BookStore.Application.Carts.Dtos;
using MediatR;

namespace BookStore.Application.Carts.Queries.PreviewCart;

public class PreviewCartQuery : IRequest<CartDto>
{
    public List<SyncCartItemDto> Items { get; set; } = [];
}
