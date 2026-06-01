using BookStore.Application.Customers.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Customers.Queries.GetCustomerById;

internal class GetCustomerByIdQueryHandler(
    ILogger<GetCustomerByIdQueryHandler> logger,
    ICustomersRepository repository) : IRequestHandler<GetCustomerByIdQuery, AdminCustomerDto>
{
    public async Task<AdminCustomerDto> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Customer {request.CustomerId}");
        var entity = await repository.GetByIdAsync(request.CustomerId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Customer), request.CustomerId.ToString());
            
        return new AdminCustomerDto
        {
            CustomerId = entity.CustomerId,
            UserId = entity.UserId,
            DisplayName = entity.User?.DisplayName ?? entity.User?.Email ?? $"Customer #{entity.CustomerId}",
            Email = entity.User?.Email ?? string.Empty,
            Phone = entity.User?.PhoneNumber,
            ImagePath = entity.User?.ImagePath,
            MemberSince = entity.MemeberSince,
            OrdersCount = entity.Orders.Count,
            TotalSpent = entity.Orders.Sum(o => o.TotalAmount),
            IsDeleted = entity.IsDeleted
        };
    }
}
