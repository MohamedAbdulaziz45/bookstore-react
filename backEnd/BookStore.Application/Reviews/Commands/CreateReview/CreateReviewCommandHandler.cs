using AutoMapper;
using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Commands.CreateReview;

internal class CreateReviewCommandHandler(
ILogger<CreateReviewCommandHandler> logger, 
IMapper mapper, 
IReviewsRepository reviewRepository,
IUserContext userContext,
ICustomersRepository customersRepository,
IOrdersRepository ordersRepository,
IBooksRepository booksRepository,
INotificationsRepository notificationsRepository)
: IRequestHandler<CreateReviewCommand, int>
{
    public async Task<int> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {


        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user.Id);

        if (customer == null)
        {
            throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");
        }

        var HasReview = await reviewRepository.HasReviewForBookAsync(customer.CustomerId,request.BookId);
        if(HasReview ){
            throw new Exception("customer already made a review for this book");
        }
     
        var hasPurchased = await ordersRepository.HasCustomerPurchasedBookAsync(customer.CustomerId, request.BookId);
        if (!hasPurchased)
            throw new BadRequestException("You can only review books you have purchased.");
     
        logger.LogInformation("User {UserId} is creating a review", user.Id);
        var entity = mapper.Map<Review>(request);
       
        entity.CustomerId = customer.CustomerId;
        var id = await reviewRepository.CreateAsync(entity);
       
        var book = await booksRepository.GetByIdAsync(request.BookId);

        await notificationsRepository.CreateAsync(new Notification
        {
            CustomerId = customer.CustomerId,
            Title = "Review submitted",
            Message = $"Your review for \"{book!.Title}\" was submitted successfully.",
            Type = "ReviewSubmitted",
            LinkUrl = $"/book/{request.BookId}",
            IsRead = false
        });

        return id;
    }
}
