
using AutoMapper;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Services.CartService;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Commands.DeleteCartItem;

internal class DeleteCartItemCommandHandler(
ILogger<DeleteCartItemCommandHandler> logger,
ICartsRepository cartsRepository,
IMapper mapper,
ICartService cartService,
IUserContext userContext,
ICustomersRepository customersRepository) : IRequestHandler<DeleteCartItemCommand,CartDto>
{
    public async Task<CartDto> Handle(DeleteCartItemCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedAccessException("Wrong authentication.");
        }

        var customer = await customersRepository.GetByUserIdAsync(user.Id);

        if (customer == null)
        {
            throw new NotFoundException("customer", "wrong id");
        }
        logger.LogInformation(
        "Deleting cart item for customer {CustomerId}, book {BookId}",
        customer.CustomerId,
        request.BookId);

        await cartService.RemoveItemAsync(customer.CustomerId, request.BookId);

        var updatedCart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId)
        ?? throw new NotFoundException("cart", customer.CustomerId.ToString());

        return mapper.Map<CartDto>(updatedCart);

    }
}
