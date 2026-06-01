using MediatR;

namespace BookStore.Application.Customers.Commands.DeleteCustomer;

public class DeleteCustomerCommand(int id) : IRequest<bool>
{
    public int CustomerId { get; } = id;
}
