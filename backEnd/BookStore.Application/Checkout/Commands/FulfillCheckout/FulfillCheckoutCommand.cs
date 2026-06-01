using MediatR;

namespace BookStore.Application.Checkout.Commands.FulfillCheckout;

public class FulfillCheckoutCommand : IRequest
{
    public string EventId { get; set; } = default!;
    public string EventType { get; set; } = default!;
    public string StripeSessionId { get; set; } = default!;
    public string? StripePaymentIntentId { get; set; }
    public string? StripeCustomerId { get; set; }
    public long AmountTotalMinorUnits { get; set; }
    public string Currency { get; set; } = "egp";
}
