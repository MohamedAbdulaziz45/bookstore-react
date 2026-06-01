using BookStore.Application.Checkout.Commands.FulfillCheckout;
using BookStore.Application.Services.PaymentService.CheckoutFulfillment;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Checkout.Commands.ExpireCheckout;

internal class ExpireCheckoutCommandHandler(
    ILogger<ExpireCheckoutCommandHandler> logger,
    ICheckoutFulfillmentService checkoutFulfillmentService)
    : IRequestHandler<ExpireCheckoutCommand>
{
    public async Task Handle(ExpireCheckoutCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
     "Stripe checkout expired event {EventId} ({EventType}) for session {StripeSessionId}.",
     request.EventId,
     request.EventType,
     request.StripeSessionId);

        await checkoutFulfillmentService.MarkCheckoutExpiredAsync(new ExpireCheckoutData
        {
            EventId = request.EventId,
            EventType = request.EventType,
            StripeSessionId = request.StripeSessionId
        }, cancellationToken);
    }
}
