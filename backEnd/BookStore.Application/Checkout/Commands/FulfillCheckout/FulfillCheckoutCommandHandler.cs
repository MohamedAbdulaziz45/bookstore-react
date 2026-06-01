using BookStore.Application.Services.PaymentService.CheckoutFulfillment;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Checkout.Commands.FulfillCheckout;

internal class FulfillCheckoutCommandHandler(
    ILogger<FulfillCheckoutCommandHandler> logger,
    ICheckoutFulfillmentService checkoutFulfillmentService)
    : IRequestHandler<FulfillCheckoutCommand>
{
    public async Task Handle(FulfillCheckoutCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Fulfilling Stripe checkout event {EventId} ({EventType}) for session {StripeSessionId}.",
            request.EventId,
            request.EventType,
            request.StripeSessionId);

        await checkoutFulfillmentService.FulfillPaidCheckoutAsync(new FulfillCheckoutData
        {
            EventId = request.EventId,
            EventType = request.EventType,
            StripeSessionId = request.StripeSessionId,
            StripePaymentIntentId = request.StripePaymentIntentId,
            StripeCustomerId = request.StripeCustomerId,
            AmountTotalMinorUnits = request.AmountTotalMinorUnits,
            Currency = request.Currency
        }, cancellationToken);
    }
}
