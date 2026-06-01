
using AutoMapper;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Reviews.Commands.CreateReview;
using BookStore.Application.Services.CartService;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Commands.AddOrUpdateCartItem;

internal class AddOrUpdateCartItemCommandHandler(
ILogger<AddOrUpdateCartItemCommandHandler> logger,
IMapper mapper,
ICartService cartService,
ICartsRepository cartsRepository,
IUserContext userContext,
ICustomersRepository customersRepository,
IBooksRepository booksRepository)
: IRequestHandler<AddOrUpdateCartItemCommand, CartDto>
{
    public async Task<CartDto> Handle(AddOrUpdateCartItemCommand request, CancellationToken cancellationToken)
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
     "Adding or updating cart item for customer {CustomerId}, book {BookId}, change {QuantityChange}",
     customer.CustomerId,
     request.BookId,
     request.QuantityChange);

        var book = await booksRepository.GetByIdAsync(request.BookId);
        if (book == null) throw new NotFoundException("book", request.BookId.ToString());
        
        var cart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId);

        if (cart == null)
        {
            cart = new Cart { CustomerId = customer.CustomerId };
            await cartsRepository.CreateAsync(cart);
        }
        var existingItem = cart!.CartItems.FirstOrDefault(ci => ci.BookId == request.BookId);

        var newQuantity = (existingItem?.Quantity ?? 0) + request.QuantityChange;

        if (newQuantity <= 0)
        {
            // Quantity dropped to 0 or below — remove the item
            if (existingItem != null)
            {
                await cartsRepository.RemoveItemAsync(existingItem.CartItemId);
            }
        }
        else
        {
            // Cap at stock — don't exceed what's available
            if (newQuantity > book.QuantityInStock)
            {
                newQuantity = book.QuantityInStock;
            }

            // Calculate the adjusted change to reach the capped quantity
            var adjustedChange = newQuantity - (existingItem?.Quantity ?? 0);
            await cartService.AddOrUpdateItem(customer.CustomerId, request.BookId, adjustedChange);
        }

        // Re-fetch cart so returned DTO reflects actual state
        cart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId);
        var entity = mapper.Map<CartDto>(cart);  

        return entity;
    }
}
