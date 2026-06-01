using BookStore.Application.Services.PaymentService.CheckoutFulfillment;
using BookStore.Application.Services.PaymentService.Stripe;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Persistence;
using BookStore.Infrastructure.Services.Payment.Stripe;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Threading;

namespace BookStore.Infrastructure.Services.Payment.CheckoutFulfillment;

internal class CheckoutFulfillmentService(BookStoreDBContext dbContext, IStripeService stripeService) : ICheckoutFulfillmentService
{
    public async Task FulfillPaidCheckoutAsync(FulfillCheckoutData data, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await dbContext.Database
            .BeginTransactionAsync(IsolationLevel.Serializable,cancellationToken);

          try
          {
                // 1. Idempotency check inside transaction
                var alreadyProcessed = await dbContext.ProcessedWebhookEvents
                .AnyAsync(e => e.EventId == data.EventId,cancellationToken);
                if (alreadyProcessed)
                {
                 await transaction.RollbackAsync(cancellationToken);
                    return;
                }

                // 2. Duplicate order check — record event so future duplicates are caught
                var orderExists = await dbContext.Orders
                .AnyAsync(o => o.StripeSessionId == data.StripeSessionId, cancellationToken);

                if (orderExists)
                {
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }
                // 3. Load checkout intent — ShippingAddress owned type loads automatically

                var checkoutIntent = await dbContext.CheckoutIntents
                .Include(c=>c.Items)
                .SingleOrDefaultAsync(c=>c.StripeSessionId == data.StripeSessionId);

                // 4. Not found — record event and commit, don't throw forever
                if (checkoutIntent == null)
                {
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }

                // 5. Terminal status guard
                if (checkoutIntent!.Status is CheckoutIntentStatus.Fulfilled 
                or CheckoutIntentStatus.Failed
                or CheckoutIntentStatus.Expired)
                {
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }

                // 6. Validate amount and currency — refund BEFORE recording event
                var expectedMinorUnits = (long)Math.Round(checkoutIntent.TotalAmount * 100m);
                if(!string.Equals(data.Currency,"egp",StringComparison.OrdinalIgnoreCase)
                || data.AmountTotalMinorUnits != expectedMinorUnits){

                    if (!string.IsNullOrEmpty(data.StripePaymentIntentId))
                        await stripeService.RefundPaymentAsync(
                            data.StripePaymentIntentId,
                            $"amount_mismatch_{data.StripeSessionId}",
                            cancellationToken);

                    checkoutIntent.Status = CheckoutIntentStatus.Failed;
                    checkoutIntent.FailureReason = "Stripe amount/currency mismatch";
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken) ;
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }

                // 7. Stock validation — refund BEFORE recording event
                foreach (var item in checkoutIntent.Items)
                {
                   var book = await dbContext.Books
                       .SingleOrDefaultAsync(b=>b.BookId == item.BookId);

                    if(book == null || book.QuantityInStock < item.Quantity)
                    {
                        if (!string.IsNullOrEmpty(data.StripePaymentIntentId))
                            await stripeService.RefundPaymentAsync(
                                data.StripePaymentIntentId,
                                $"stock_failed_{data.StripeSessionId}_{item.BookId}",
                                cancellationToken);

                        checkoutIntent.Status= CheckoutIntentStatus.Failed;
                        checkoutIntent.FailureReason = $"Insufficient stock for BookId {item.BookId}";
                        dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                        await dbContext.SaveChangesAsync(cancellationToken);
                        await transaction.CommitAsync(cancellationToken);
                        return;
                    }
                }

                // 8. Create order
                var order = CreateOrder(data, checkoutIntent);
                dbContext.Orders.Add(order);
                await dbContext.SaveChangesAsync(cancellationToken);

                // 9. Create order items + decrement stock
                await DecrementStockAndCreateItemsAsync(order.OrderId, checkoutIntent.Items, cancellationToken);

                // 10. Create payment record
                dbContext.Payments.Add(CreatePayment(order.OrderId, data, checkoutIntent.TotalAmount));

                // 11. Update StripeCustomerId on customer
                if(!string.IsNullOrEmpty(data.StripeCustomerId))
                {
                    var customer = await dbContext.Customers
                        .SingleOrDefaultAsync(c => c.CustomerId == checkoutIntent.CustomerId);
                    if(customer != null && string.IsNullOrEmpty(customer.StripeCustomerId))
                       customer.StripeCustomerId = data.StripeCustomerId;
                }

                // 12. Mark checkout intent fulfilled
                checkoutIntent.Status = CheckoutIntentStatus.Fulfilled;
                checkoutIntent.FulfilledAt = DateTime.UtcNow;

                // 13. Clear purchased cart items only
                await ClearPurchasedCartItemsAsync(checkoutIntent, cancellationToken);

                // 14. Record webhook event
                dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));

                await dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }
            catch
            {
               await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        });
    }

    public async Task MarkCheckoutExpiredAsync(ExpireCheckoutData data,CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await dbContext.Database
                 .BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);

            try
            {
                var alreadyProcessed = await dbContext.ProcessedWebhookEvents
                    .AnyAsync(e => e.EventId == data.EventId, cancellationToken);
                if (alreadyProcessed)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return;
                }


                var checkoutIntent = await dbContext.CheckoutIntents
                    .SingleOrDefaultAsync(c => c.StripeSessionId == data.StripeSessionId, cancellationToken);

                // 2. Not found — record event and commit
                if (checkoutIntent == null)
                {
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }

                // 3. Don't override terminal statuses
                if (checkoutIntent.Status is CheckoutIntentStatus.Fulfilled
                    or CheckoutIntentStatus.Failed
                    or CheckoutIntentStatus.Expired)
                {
                    dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return;
                }
                checkoutIntent.Status = CheckoutIntentStatus.Expired;
                dbContext.ProcessedWebhookEvents.Add(BuildWebhookEvent(data.EventId, data.EventType));

                await dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        });
    }

    private static ProcessedWebhookEvent BuildWebhookEvent(string eventId,string eventType) 
    {
        return new ProcessedWebhookEvent()
        {
            EventId = eventId,
            EventType = eventType,
            ProcessedAt = DateTime.UtcNow,
        };
    }

    private static Order CreateOrder(FulfillCheckoutData data, CheckoutIntent checkoutIntent)
    {
         var order = new Order()
         {
             CustomerId = checkoutIntent.CustomerId,
             OrderDate = DateTime.UtcNow,
             Status = OrderStatus.Pending,
             TotalAmount = checkoutIntent.TotalAmount,
             StripeSessionId = data.StripeSessionId,
             SavedAddressId = checkoutIntent.SavedAddressId,
             ShippingAddress = new ShippingAddressSnapshot
             {
                 RecipientName = checkoutIntent.ShippingAddress.RecipientName,
                 RecipientPhone = checkoutIntent.ShippingAddress.RecipientPhone,
                 AddressLine1 = checkoutIntent.ShippingAddress.AddressLine1,
                 AddressLine2 = checkoutIntent.ShippingAddress.AddressLine2,
                 City = checkoutIntent.ShippingAddress.City,
                 State = checkoutIntent.ShippingAddress.State,
                 PostalCode = checkoutIntent.ShippingAddress.PostalCode,
                 Country = checkoutIntent.ShippingAddress.Country
             }
         };

         return order;
     }
    private static Domain.Entities.Payment CreatePayment(int orderId, FulfillCheckoutData data, decimal amount) =>
    new()
    {
        OrderId = orderId,
        Amount = amount,
        Currency = "egp",
        PaymentMethod = "stripe_checkout",
        StripePaymentIntentId = data.StripePaymentIntentId,
        TransactionDate = DateTime.UtcNow
    };

    private async Task DecrementStockAndCreateItemsAsync(
    int orderId,
    IEnumerable<CheckoutIntentItem> items,
    CancellationToken cancellationToken)
    {
        foreach (var item in items)
        {
            dbContext.OrderItems.Add(new OrderItem
            {
                OrderId = orderId,
                BookId = item.BookId,
                Quantity = item.Quantity,
                Price = item.UnitPrice,
                TotalItemsPrice = item.TotalPrice
            });

            var book = await dbContext.Books
                .SingleAsync(b=>b.BookId == item.BookId);
            book.QuantityInStock -= item.Quantity;
        }
    }

    private async Task ClearPurchasedCartItemsAsync(
    CheckoutIntent checkoutIntent,
    CancellationToken cancellationToken)
    {
       var cart = await dbContext.Carts
       .Include(c=>c.CartItems)
       .SingleOrDefaultAsync(c=> c.CustomerId ==  checkoutIntent.CustomerId);

        if (cart == null) return;

        var purchasedBookIds = checkoutIntent.Items
        .Select(i => i.BookId)
        .ToHashSet();

        var itemsToRemove = cart.CartItems
            .Where(ci=>purchasedBookIds.Contains(ci.BookId)).ToList();
       
        dbContext.CartItems.RemoveRange(itemsToRemove);
    }
}