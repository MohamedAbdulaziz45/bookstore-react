namespace BookStore.Application.Payments.Dtos;

public class PaymentDto
{
    public int PaymentId { get; set; } = default;
    public decimal Amount { get; set; } = default;
    public string PaymentMethod { get; set; } = default!;
    public DateTime TransactionDate { get; set; } = default;
    public string? StripePaymentIntentId { get; set; }
    public string Currency { get; set; } = "egp";
    public int OrderId { get; set; } = default;
}
