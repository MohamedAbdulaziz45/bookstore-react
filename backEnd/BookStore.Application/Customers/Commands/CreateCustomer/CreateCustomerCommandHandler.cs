using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Customers.Commands.CreateCustomer;

internal class CreateCustomerCommandHandler(ILogger<CreateCustomerCommandHandler> logger, IMapper mapper, ICustomersRepository repository) : IRequestHandler<CreateCustomerCommand, int>
{
    public async Task<int> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new Customer");
        var entity = mapper.Map<Customer>(request);
        var id = await repository.CreateAsync(entity);
        return id;
    }
}
