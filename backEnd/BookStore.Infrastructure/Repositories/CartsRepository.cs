using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class CartsRepository(BookStoreDBContext dbContext) : ICartsRepository
{
   //return IEnumerable of cartItemsView 
   public async Task<Cart?> GetByCustomerIdAsync(int customerId){
        return await dbContext.Carts
               .Include(c => c.CartItems)
               .ThenInclude(ci => ci.Book)
               .ThenInclude(b => b.BookImage)
               .FirstOrDefaultAsync(c => c.CustomerId == customerId);
    }

    public async Task<bool> ExistsAsync(int customerId)
    {
        return await dbContext.Carts
            .AnyAsync(c => c.CustomerId == customerId);
    }
    public async Task<int> CreateAsync(Cart cart)
    {
        await dbContext.Carts.AddAsync(cart);
        await dbContext.SaveChangesAsync();
        return cart.CartId;
    }
    public async Task RemoveItemAsync(int cartItemId)
    {
        var item = await dbContext.CartItems
            .FindAsync(cartItemId);

        if (item is not null)
        {
            dbContext.CartItems.Remove(item);

            await dbContext.SaveChangesAsync();
        }
          
    }

    public async Task ClearCartAsync(int cartId){
    var items = await dbContext.CartItems
        .Where(ci  => ci.CartId == cartId)
        .ToListAsync();
        dbContext.CartItems.RemoveRange(items);
        await dbContext.SaveChangesAsync();
    }

    public async Task ClearCartByCustomerIdAsync(int customerId)
    {
        var cart = await dbContext.Carts
          .Include(c => c.CartItems)
          .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (cart == null || !cart.CartItems.Any())
        {
            return;
        }
        cart.CartItems.Clear();
        await dbContext.SaveChangesAsync();
    }

    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }
}

