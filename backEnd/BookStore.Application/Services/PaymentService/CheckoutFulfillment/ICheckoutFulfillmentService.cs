namespace BookStore.Application.Services.PaymentService.CheckoutFulfillment;

public interface ICheckoutFulfillmentService
{
    Task FulfillPaidCheckoutAsync(FulfillCheckoutData data,CancellationToken cancellationToken);
    Task MarkCheckoutExpiredAsync(ExpireCheckoutData data, CancellationToken cancellationToken);

}

public class FulfillCheckoutData
{
    public string EventId { get; set; } = default!;
    public string EventType { get; set; } = default!;
    public string StripeSessionId { get; set; } = default!;
    public string? StripePaymentIntentId { get; set; }
    public string? StripeCustomerId { get; set; }
    public long AmountTotalMinorUnits { get; set; }
    public string Currency { get; set; } = "egp";
}

public class ExpireCheckoutData
{
    public string EventId { get; set; } = default!;
    public string EventType { get; set; } = default!;
    public string StripeSessionId { get; set; } = default!;
}