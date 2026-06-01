using BookStore.Application.Customers.Dtos;
using MediatR;

namespace BookStore.Application.Customers.Queries.GetCustomerById;

public class GetCustomerByIdQuery(int id) : IRequest<AdminCustomerDto>
{
    public int CustomerId { get; } = id;
}
