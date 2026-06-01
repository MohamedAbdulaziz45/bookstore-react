using BookStore.Application.Services.PaymentService.Contracts;
using BookStore.Application.Services.PaymentService.Stripe;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using static BookStore.Application.Services.PaymentService.Contracts.StripeDtos;
namespace BookStore.Infrastructure.Services.Payment.Stripe;

public class StripeService : IStripeService
{
    private readonly string _webhookSecret;

    public StripeService(IOptions<StripeSettings> options)
    {
        var settings = options.Value;
        StripeConfiguration.ApiKey = settings.SecretKey;
        _webhookSecret = settings.WebhookSecret;
    }
    public StripeWebhookEventDto ConstructWebhookEvent(string json, string signature)
    {
        var stripeEvent = EventUtility.ConstructEvent(json, signature, _webhookSecret);

        var session = stripeEvent.Data.Object as Session;

        return new StripeWebhookEventDto(
        EventId: stripeEvent.Id,
        EventType: stripeEvent.Type,
               SessionId: session?.Id,
            PaymentStatus: session?.PaymentStatus,
            PaymentIntentId: session?.PaymentIntentId,
            CustomerId: session?.CustomerId,
            AmountTotalMinorUnits: session?.AmountTotal ?? 0,
            Currency: session?.Currency ?? "egp");
    }

    public async Task<StripeCheckoutSessionResult> CreateCheckoutSessionAsync(CreateStripeCheckoutSessionRequest request,CancellationToken cancellationToken)
    {
        var service = new SessionService();
        var options = new SessionCreateOptions
        {
            Mode = "payment",
            Customer = request.StripeCustomerId,
            SuccessUrl = request.SuccessUrl,
            CancelUrl = request.CancelUrl,
            ClientReferenceId = request.CheckoutIntentId.ToString(),
            Metadata = new Dictionary<string, string>
            {
                ["checkout_intent_id"] = request.CheckoutIntentId.ToString()
            },
            LineItems = request.LineItems.Select(item => new SessionLineItemOptions
            {
               Quantity = item.Quantity,
               PriceData = new SessionLineItemPriceDataOptions
               {
                 Currency = "egp",
                 UnitAmount = item.UnitAmountMinorUnits,
                 ProductData = new SessionLineItemPriceDataProductDataOptions
                 {
                 Name = item.Name,
                 }
               }
            }).ToList()
        };

        var session = await service.CreateAsync(options,null,cancellationToken);

        return new StripeCheckoutSessionResult(
       SessionId:session.Id,
        SessionUrl:session.Url);
    }

    public async Task<string> CreateOrGetStripeCustomerAsync(string? existingStripeCustomerId, string email, string name,CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(existingStripeCustomerId))
            return existingStripeCustomerId;

        var service = new CustomerService();
        var options = new CustomerCreateOptions
        {
            Email = email,
            Name = name
        };

        var customer = await service.CreateAsync(options, null, cancellationToken);
        return customer.Id;
    }

    public async Task RefundPaymentAsync(string paymentIntentId, string idempotencyKey, CancellationToken cancellationToken)
    {
        var service = new RefundService();
        var options = new RefundCreateOptions
        {
            PaymentIntent = paymentIntentId,
        };

        var requestOptions = new RequestOptions
        {
            IdempotencyKey = idempotencyKey,
        };

        await service.CreateAsync(options, requestOptions,cancellationToken);
    }
}
