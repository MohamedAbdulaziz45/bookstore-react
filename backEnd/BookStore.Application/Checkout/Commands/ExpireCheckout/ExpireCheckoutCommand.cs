using MediatR;

namespace BookStore.Application.Checkout.Commands.ExpireCheckout;

public class ExpireCheckoutCommand : IRequest
{
    public string EventId { get; set; } = default!;
    public string EventType { get; set; } = default!;
    public string StripeSessionId { get; set; } = default!;
}
