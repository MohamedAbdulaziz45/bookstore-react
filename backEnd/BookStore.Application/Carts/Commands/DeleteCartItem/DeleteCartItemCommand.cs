using BookStore.Application.Carts.Dtos;
using MediatR;

namespace BookStore.Application.Carts.Commands.DeleteCartItem;

public class DeleteCartItemCommand(int bookId): IRequest<CartDto>
{
  public int BookId { get; } = bookId;
}
