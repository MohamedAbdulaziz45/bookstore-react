using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Application.Services.CartService;

public interface ICartService
{
    Task AddOrUpdateItem(int customerId, int bookId, int quantity);
    Task RemoveItemAsync(int customerId, int bookId);
}
