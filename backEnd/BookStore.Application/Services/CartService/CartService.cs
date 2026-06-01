using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;

namespace BookStore.Application.Services.CartService;

public class CartService(ICartsRepository cartsRepository):ICartService
{
    public async Task AddOrUpdateItem(int customerId, int bookId, int quantity)
    {
        var cart = await cartsRepository.GetByCustomerIdAsync(customerId);

        if (cart == null && quantity <= 0)
        {
            throw new BadRequestException("Quantity must be greater than 0 when creating a cart item.");
        }

        if (cart == null)
        {
            cart = new Cart
            {
                CustomerId = customerId
            };

            await cartsRepository.CreateAsync(cart);
        }

        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);

        if (existingItem == null)
        {
            if (quantity <= 0)
                throw new BadRequestException("Quantity must be greater than 0 when adding a cart item.");

            cart.CartItems.Add(new CartItem { BookId = bookId, Quantity = quantity });
        }
        else
        {
            existingItem.Quantity += quantity;

            if (existingItem.Quantity <= 0)
                cart.CartItems.Remove(existingItem);
        }

        await cartsRepository.SaveChanges();
    }
    public async Task RemoveItemAsync(int customerId, int bookId){
        var cart = await cartsRepository.GetByCustomerIdAsync(customerId);

        if (cart == null)
        {
            throw new NotFoundException("cart with customerId = {customerId} not found", customerId.ToString());
        }

        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
        if (existingItem != null)
        {
    
                cart.CartItems.Remove(existingItem);
           
        }
        await cartsRepository.SaveChanges();
    }
}
