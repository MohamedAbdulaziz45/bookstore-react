using AutoMapper;
using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Commands.UpdateReview;

internal class UpdateReviewCommandHandler(
ILogger<UpdateReviewCommandHandler> logger,
IUserContext userContext,
ICustomersRepository customersRepository,
IMapper mapper,
IReviewsRepository repository) : IRequestHandler<UpdateReviewCommand, bool>
{
    public async Task<bool> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating Review {ReviewId}", request.ReviewId);

        var existingEntity = await repository.GetByIdAsync(request.ReviewId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Review), request.ReviewId.ToString());

        var user = userContext.GetCurrentUser()
            ?? throw new ForbidException();
        if (!user.Roles.Contains(UserRoles.Admin))
        {
            var customer = await customersRepository.GetByUserIdAsync(user.Id)
                ?? throw new ForbidException();
            if (existingEntity.CustomerId != customer.CustomerId)
                throw new ForbidException();
        }

        mapper.Map(request, existingEntity);
        return await repository.UpdateAsync(existingEntity);
    }
}
