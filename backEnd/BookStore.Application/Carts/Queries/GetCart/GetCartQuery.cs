using BookStore.Application.Carts.Dtos;
using MediatR;

namespace BookStore.Application.Carts.Queries.GetCart;
public class GetCartQuery : IRequest<CartDto>
{
}
