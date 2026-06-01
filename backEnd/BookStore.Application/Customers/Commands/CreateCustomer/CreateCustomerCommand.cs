using MediatR;

namespace BookStore.Application.Customers.Commands.CreateCustomer;

public class CreateCustomerCommand : IRequest<int>
{
    public DateTime MemeberSince { get; set; } = default;
    public string UserId { get; set; } = default!;
}
