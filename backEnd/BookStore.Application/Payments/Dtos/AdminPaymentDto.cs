namespace BookStore.Application.Payments.Dtos;

public class AdminPaymentDto : PaymentDto
{
    public string Customer { get; set; } = default!;
}
