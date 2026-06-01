

using BookStore.Application.Carts.Dtos;
using MediatR;

namespace BookStore.Application.Carts.Commands.AddOrUpdateCartItem;

public class AddOrUpdateCartItemCommand : IRequest<CartDto>
{
    public int BookId { get; set; }
    public int QuantityChange { get; set; }
}
