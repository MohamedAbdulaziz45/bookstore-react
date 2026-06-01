using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Shippings.Commands.UpdateShipping;

internal class UpdateShippingCommandHandler(ILogger<UpdateShippingCommandHandler> logger, IMapper mapper, IShippingsRepository repository) : IRequestHandler<UpdateShippingCommand, bool>
{
    public async Task<bool> Handle(UpdateShippingCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating Shipping {request.ShippingId}");
        
        var existingEntity = await repository.GetByIdAsync(request.ShippingId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Shipping), request.ShippingId.ToString());

        mapper.Map(request, existingEntity);
        return await repository.UpdateAsync(existingEntity);
    }
}
