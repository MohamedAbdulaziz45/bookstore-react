using AutoMapper;
using BookStore.Application.Carts.Commands.SyncCartItem;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Queries.PreviewCart;

internal class PreviewCartQueryHandler(
ILogger<PreviewCartQueryHandler> logger,
IBooksRepository booksRepository)
: IRequestHandler<PreviewCartQuery, CartDto> 

{
    public async Task<CartDto> Handle(PreviewCartQuery request, CancellationToken cancellationToken)
    {
        var ids = request.Items.Select(i => i.BookId);

        var books = await booksRepository.GetByIdsAsync(ids);

        var items = request.Items.Select(items =>{

            var book = books.FirstOrDefault(b => b.BookId == items.BookId);
            if (book == null) return null;

            return new CartItemDto
            {
                CartItemId = 0,
                BookId = book.BookId,
                Title = book.Title,
                Price = book.Price,
                Quantity = items.Quantity,
                QuantityInStock = book.QuantityInStock,
                ImageUrl = book.BookImage,
                LineTotal = book.Price * items.Quantity,
            };
        }).Where(i=>i !=null)
        .ToList();

        logger.LogInformation(
         "previewing a cart with data sent by client");

        return new CartDto
        {
            CartId = 0,
            CustomerId = 0,
            TotalItems = items.Sum(i => i!.Quantity),
            Subtotal = items.Sum(i => i!.LineTotal),
            Items = items!
        };
    }
}
