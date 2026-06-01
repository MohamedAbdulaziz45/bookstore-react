using MediatR;

namespace BookStore.Application.Customers.Commands.UpdateCustomer;

public class UpdateCustomerCommand : IRequest<bool>
{
    public int CustomerId { get; set; } = default;
    public DateTime MemeberSince { get; set; } = default;
    public string UserId { get; set; } = default!;
}
