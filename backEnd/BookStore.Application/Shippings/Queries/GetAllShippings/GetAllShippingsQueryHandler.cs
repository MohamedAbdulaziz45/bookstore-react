using AutoMapper;
using BookStore.Application.Shippings.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Shippings.Queries.GetAllShippings;

internal class GetAllShippingsQueryHandler(ILogger<GetAllShippingsQueryHandler> logger,
IMapper mapper,
IShippingsRepository repository) : IRequestHandler<GetAllShippingsQuery, IEnumerable<ShippingDto>>
{
    public async Task<IEnumerable<ShippingDto>> Handle(GetAllShippingsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Shippings");
        var entities = await repository.GetAllAsync();
        return entities.Select(shipping => new AdminShippingDto
        {
            ShippingId = shipping.ShippingId,
            CarrierName = shipping.CarrierName,
            TrackingNumber = shipping.TrackingNumber,
            ShippingStatus = shipping.ShippingStatus,
            EstimatedDeliveryDate = shipping.EstimatedDeliveryDate,
            ActualDeliveryDate = shipping.ActualDeliveryDate,
            OrderId = shipping.OrderId,
            Customer = shipping.Order?.Customer?.User?.DisplayName
                ?? shipping.Order?.Customer?.User?.Email
                ?? $"Customer #{shipping.Order?.CustomerId ?? 0}"
        }).ToList();
    }
}
