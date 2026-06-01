using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Commands.DeleteReview;

internal class DeleteReviewCommandHandler(
ILogger<DeleteReviewCommandHandler> logger,
IReviewsRepository repository,
ICustomersRepository customersRepository,
IUserContext userContext) 
: IRequestHandler<DeleteReviewCommand, bool>
{
    public async Task<bool> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();
        logger.LogInformation("Deleting Review {ReviewId}", request.ReviewId);

        var existingEntity = await repository.GetByIdAsync(request.ReviewId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Review), request.ReviewId.ToString());

        if (!user!.Roles.Contains(UserRoles.Admin))
        {
            var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new ForbidException();
            if (existingEntity.CustomerId != customer.CustomerId)
                throw new ForbidException();
        }


        return await repository.DeleteAsync(request.ReviewId);
    }
}
