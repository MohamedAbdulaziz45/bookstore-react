using AutoMapper;
using BookStore.Application.Orders.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Queries.GetOrderById;

internal class GetOrderByIdQueryHandler(ILogger<GetOrderByIdQueryHandler> logger, IMapper mapper, IOrdersRepository repository) : IRequestHandler<GetOrderByIdQuery, OrderDto>
{
    public async Task<OrderDto> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Order {request.OrderId}");
        var entity = await repository.GetByIdAsync(request.OrderId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Order), request.OrderId.ToString());
            
        return mapper.Map<OrderDto>(entity);
    }
}
