using BookStore.Application.Checkout.Dtos;
using BookStore.Application.Services.PaymentService.Stripe;
using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using static BookStore.Application.Services.PaymentService.Contracts.StripeDtos;

namespace BookStore.Application.Checkout.Commands.CreateCheckoutSession;

public class CreateCheckoutSessionCommandHandler(
ILogger<CreateCheckoutSessionCommandHandler> logger,
IUserContext userContext,
 ICustomersRepository customersRepository,
 IAddressesRepository addressesRepository,
 ICartsRepository cartsRepository,
 ICheckoutIntentsRepository checkoutIntentsRepository,
 IStripeService stripeService,
 IOptions<StripeSettings> stripeSettings
)
: IRequestHandler<CreateCheckoutSessionCommand, CreateCheckoutSessionResult>
{
    public async Task<CreateCheckoutSessionResult> Handle(CreateCheckoutSessionCommand request, CancellationToken cancellationToken)
    {

        logger.LogInformation("Creating new session.");
        var user = userContext.GetCurrentUser();
        
        var customer = await customersRepository.GetByUserIdAsync(user!.Id);

        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        }

        var address = await addressesRepository.GetByIdAsync(request.ShippingAddressId)
        ?? throw new NotFoundException("Address",request.ShippingAddressId.ToString());

        if (address.CustomerId != customer.CustomerId)
            throw new Exception("Address does not belong to this customer.");

        var cart = await cartsRepository.GetByCustomerIdAsync(customer.CustomerId)
         ?? throw new BadRequestException("Cart not found");

         if(cart.CartItems == null || !cart.CartItems.Any()){
            throw new BadRequestException("Cannot checkout with an empty cart.");
        }

        var groupedItems = cart.CartItems
        .GroupBy(i=> i.BookId)
        .Select(g=>
        {
            var first = g.First();
            var book = first.Book
            ?? throw new InvalidOperationException(
                $"Book navigation property was not loaded for CartItem " +
                $"{first.CartItemId} (BookId: {first.BookId}).");

            var quantity = g.Sum(i => i.Quantity);

            return new CheckoutIntentItem
            {
                BookId = first.BookId,
                BookTitle = first.Book.Title,
                Quantity = quantity,
                UnitPrice = first.Book.Price,
                TotalPrice = first.Book.Price * quantity
            };
        })
        .ToList();  

        foreach(var item in groupedItems)
        {
          var book = cart.CartItems.First(ci => ci.BookId == item.BookId).Book!;
            if (book.QuantityInStock < item.Quantity)
                throw new
                BadRequestException($"Insufficient stock for '{item.BookTitle}'" +
                $". Available: {book.QuantityInStock}.");
        }

        var totalAmount = groupedItems.Sum(i => i.TotalPrice);

        if(user.DisplayName == null)
        {
          throw new  BadRequestException("missing displayName");
        }
        var stripeCustomerId = await stripeService.CreateOrGetStripeCustomerAsync(
        customer.StripeCustomerId,
        user.Email,
        user.DisplayName!,cancellationToken);

        if(string.IsNullOrEmpty(customer.StripeCustomerId))
        {
          customer.StripeCustomerId = stripeCustomerId;
          await customersRepository.UpdateAsync(customer);
        }

        var checkoutIntent = new CheckoutIntent
        {
            CustomerId = customer.CustomerId,
            Status = CheckoutIntentStatus.Created,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = totalAmount,
            Currency = "egp",
            StripeCustomerId = stripeCustomerId,
            SavedAddressId = address.AddressId,
            ShippingAddress = new ShippingAddressSnapshot
            {
                RecipientName = address.FullName,
                RecipientPhone = address.Phone,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
            },
            Items = groupedItems

        };

        var checkoutIntentId = await checkoutIntentsRepository.CreateAsync(checkoutIntent);

        var settings = stripeSettings.Value;
        var lineIteams = groupedItems.Select(i => new StripeCheckoutLineItem(
        Name: i.BookTitle,
        UnitAmountMinorUnits: (long)Math.Round(i.UnitPrice * 100m),
        Quantity: i.Quantity));

        var sessionResult = await stripeService.CreateCheckoutSessionAsync(
        new CreateStripeCheckoutSessionRequest(
        StripeCustomerId: stripeCustomerId,
        CheckoutIntentId: checkoutIntentId,
        LineItems: lineIteams,
        SuccessUrl: settings.SuccessUrl,
        CancelUrl: settings.CancelUrl),cancellationToken);

        await checkoutIntentsRepository.UpdateStripeSessionAsync(
        checkoutIntentId,
        sessionResult.SessionId,
        stripeCustomerId);

        return new CreateCheckoutSessionResult { SessionUrl = sessionResult.SessionUrl };
    }
}
