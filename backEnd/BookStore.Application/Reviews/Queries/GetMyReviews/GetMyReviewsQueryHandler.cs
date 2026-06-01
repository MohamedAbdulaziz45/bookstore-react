using AutoMapper;
using BookStore.Application.Reviews.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Queries.GetMyReviews;

internal class GetMyReviewsQueryHandler(
    ILogger<GetMyReviewsQueryHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IReviewsRepository repository) : IRequestHandler<GetMyReviewsQuery, IEnumerable<ReviewDto>>
{
    public async Task<IEnumerable<ReviewDto>> Handle(GetMyReviewsQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        logger.LogInformation("Getting reviews for Customer {CustomerId}", customer.CustomerId);
        var entities = await repository.GetAllByCustomerIdAsync(customer.CustomerId);
        return mapper.Map<IEnumerable<ReviewDto>>(entities);
    }
}

