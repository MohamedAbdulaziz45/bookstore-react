namespace BookStore.Application.Services.PaymentService.Stripe;

public class StripeSettings
{
    public string SecretKey { get; set; } = default!;
    public string WebhookSecret { get; set; } = default!;
    public string SuccessUrl { get; set; } = default!;
    public string CancelUrl { get; set; } = default!;
}
