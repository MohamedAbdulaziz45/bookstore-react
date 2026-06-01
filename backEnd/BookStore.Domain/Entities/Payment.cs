using System;

namespace BookStore.Domain.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = default!;
    public DateTime TransactionDate { get; set; }
    public string? StripePaymentIntentId { get; set; }
    public string Currency { get; set; } = "egp";
    public int OrderId { get; set; }
    public Order? Order { get; set; }
}
