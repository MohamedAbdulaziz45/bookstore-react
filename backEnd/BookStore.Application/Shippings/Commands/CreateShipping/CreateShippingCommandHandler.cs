using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Shippings.Commands.CreateShipping;

internal class CreateShippingCommandHandler(ILogger<CreateShippingCommandHandler> logger, IMapper mapper, IShippingsRepository repository) : IRequestHandler<CreateShippingCommand, int>
{
    public async Task<int> Handle(CreateShippingCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new Shipping");
        var entity = mapper.Map<Shipping>(request);
        var id = await repository.CreateAsync(entity);
        return id;
    }
}
