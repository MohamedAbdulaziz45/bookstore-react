using AutoMapper;
using BookStore.Application.Reviews.Dtos;
using BookStore.Application.Users;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Queries.GetMyReviewByBookId;

internal class GetMyReviewByBookIdQueryHandler(
    ILogger<GetMyReviewByBookIdQueryHandler> logger,
    IMapper mapper,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IReviewsRepository reviewsRepository) : IRequestHandler<GetMyReviewByBookIdQuery, ReviewDto?>
{
    public async Task<ReviewDto?> Handle(GetMyReviewByBookIdQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        logger.LogInformation(
            "Getting my review for Customer {CustomerId}, Book {BookId}",
            customer.CustomerId,
            request.BookId);

        var entity = await reviewsRepository.GetByCustomerIdAndBookIdAsync(customer.CustomerId, request.BookId);
        return entity == null ? null : mapper.Map<ReviewDto>(entity);
    }
}

