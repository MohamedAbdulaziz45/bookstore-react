

using AutoMapper;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Queries.GetCart;

internal class GetCartQueryHandler(
ILogger<GetCartQueryHandler> logger,
IMapper mapper,
ICartsRepository cartsRepository,
IUserContext userContext,
ICustomersRepository customersRepository) : IRequestHandler<GetCartQuery, CartDto>
{
    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            throw new NotFoundException("user", "wrong authintication");
        }

        var customer = await customersRepository.GetByUserIdAsync(user!.Id);

        if (customer == null)
        {
            throw new NotFoundException("customer", "wrong id");

        }

        var cart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId);
        if (cart is null)
        {
            throw new NotFoundException("cart", customer.CustomerId.ToString());
        }
       var cartDto = mapper.Map<CartDto>(cart);
        return cartDto; 
    }
}
