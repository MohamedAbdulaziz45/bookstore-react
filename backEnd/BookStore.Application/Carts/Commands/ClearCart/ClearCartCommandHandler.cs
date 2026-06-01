

using BookStore.Application.Carts.Commands.DeleteCartItem;

using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Carts.Commands.ClearCart;

internal class ClearCartCommandHandler(
ILogger<ClearCartCommandHandler> logger,
ICartsRepository cartsRepository,
IUserContext userContext,
ICustomersRepository customersRepository) : IRequestHandler<ClearCartCommand>
{
    public async Task Handle(ClearCartCommand request, CancellationToken cancellationToken)
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
"Clearing cart for customer with id= {CustomerId}",
customer.CustomerId);

        await cartsRepository.ClearCartByCustomerIdAsync(customer.CustomerId);
    }
}
