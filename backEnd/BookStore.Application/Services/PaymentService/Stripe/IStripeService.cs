using static BookStore.Application.Services.PaymentService.Contracts.StripeDtos;

namespace BookStore.Application.Services.PaymentService.Stripe;

public interface IStripeService
{
    Task<string> CreateOrGetStripeCustomerAsync(
            string? existingStripeCustomerId,
            string email,
            string name
            , CancellationToken cancellationToken);

    Task<StripeCheckoutSessionResult> CreateCheckoutSessionAsync(
        CreateStripeCheckoutSessionRequest request
        , CancellationToken cancellationToken);

    StripeWebhookEventDto ConstructWebhookEvent(string json, string signature);

    Task RefundPaymentAsync(
        string paymentIntentId,
        string idempotencyKey
        , CancellationToken cancellationToken);
}
