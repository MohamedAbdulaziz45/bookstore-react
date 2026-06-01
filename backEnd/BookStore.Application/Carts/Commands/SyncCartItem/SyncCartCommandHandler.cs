
using AutoMapper;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Commands.SyncCartItem;

internal class SyncCartCommandHandler(
ILogger<SyncCartCommandHandler> logger,
ICartsRepository cartsRepository,
ICustomersRepository customersRepository,
IBooksRepository booksRepository,
IUserContext userContext,
IMapper mapper) : IRequestHandler<SyncCartCommand, CartDto>
{
    public async Task<CartDto> Handle(SyncCartCommand request, CancellationToken cancellationToken)
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
            "syncing the cart for customer with id= {CustomerId}",
            customer.CustomerId);

        var items = request.Items
        .GroupBy(i => i.BookId)
        .Select(g => new SyncCartItemDto
        {
            BookId = g.Key,
            Quantity = g.Sum(x => x.Quantity)
        })
        .ToList();

        if (items.Count == 0)
        {
            throw new BadRequestException("Cart items are required.");
        }

        var cart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId);

        if (cart is null)
        {
            cart = new Cart { CustomerId = customer.CustomerId };
            await cartsRepository.CreateAsync(cart);    
        }

        foreach (var item in items)
        {
            var book = await booksRepository.GetByIdAsync(item.BookId);

            // Skip items where book doesn't exist or is completely out of stock
            if (book == null || book.QuantityInStock <= 0)
                continue;

            // Cap quantity at available stock
            var cappedQuantity = Math.Min(item.Quantity, book.QuantityInStock);

            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == item.BookId);

            if (existingItem is null)
            {
                cart.CartItems.Add(new CartItem
                {
                    BookId = item.BookId,
                    Quantity = cappedQuantity
                });
            }
            else
            {
                // Take the higher quantity, but still cap at stock
                existingItem.Quantity = Math.Min(
                    Math.Max(existingItem.Quantity, cappedQuantity),
                    book.QuantityInStock);
            }

        }

        await cartsRepository.SaveChanges();

        var updatedCart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId)
        ?? throw new NotFoundException("cart",customer.CustomerId.ToString());

        return mapper.Map<CartDto>(updatedCart);
    }
}
