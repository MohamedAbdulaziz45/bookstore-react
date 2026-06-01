using AutoMapper;
using BookStore.Application.Orders.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Orders.Queries.GetAllOrders;

internal class GetAllOrdersQueryHandler(ILogger<GetAllOrdersQueryHandler> logger, IMapper mapper, IOrdersRepository repository) : IRequestHandler<GetAllOrdersQuery, IEnumerable<OrderDto>>
{
    public async Task<IEnumerable<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Orders");
        var entities = await repository.GetAllAsync();
        return mapper.Map<IEnumerable<OrderDto>>(entities);
    }
}
