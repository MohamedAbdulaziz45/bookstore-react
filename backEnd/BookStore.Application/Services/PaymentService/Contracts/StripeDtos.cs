
namespace BookStore.Application.Services.PaymentService.Contracts;

public class StripeDtos
{
    public record StripeCheckoutLineItem(string Name, long UnitAmountMinorUnits, int Quantity);

    public record CreateStripeCheckoutSessionRequest(
        string StripeCustomerId,
        int CheckoutIntentId,
        IEnumerable<StripeCheckoutLineItem> LineItems,
        string SuccessUrl,
        string CancelUrl);
  
    public record StripeCheckoutSessionResult(string SessionId, string SessionUrl);

    public record StripeWebhookEventDto(
        string EventId,
        string EventType,
        string? SessionId,
        string? PaymentStatus,
        string? PaymentIntentId,
        string? CustomerId,
        long AmountTotalMinorUnits,
        string Currency);
}
