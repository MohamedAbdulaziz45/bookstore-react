using BookStore.Application.Carts.Dtos;
using MediatR;

namespace BookStore.Application.Carts.Commands.SyncCartItem;

public class SyncCartCommand : IRequest<CartDto>
{
    public List<SyncCartItemDto> Items { get; set; } = [];
}
