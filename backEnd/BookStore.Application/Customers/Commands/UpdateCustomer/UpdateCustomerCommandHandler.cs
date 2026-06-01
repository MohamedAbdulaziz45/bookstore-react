using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Customers.Commands.UpdateCustomer;

internal class UpdateCustomerCommandHandler(ILogger<UpdateCustomerCommandHandler> logger, IMapper mapper, ICustomersRepository repository) : IRequestHandler<UpdateCustomerCommand, bool>
{
    public async Task<bool> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating Customer {request.CustomerId}");
        
        var existingEntity = await repository.GetByIdAsync(request.CustomerId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Customer), request.CustomerId.ToString());

        mapper.Map(request, existingEntity);
        return await repository.UpdateAsync(existingEntity);
    }
}
