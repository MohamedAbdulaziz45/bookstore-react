using BookStore.Application.Users;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Newsletter;

internal class SubscribeNewsletterCommandHandler(
    ILogger<SubscribeNewsletterCommandHandler> logger,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    INewsletterSubscriptionsRepository newsletterSubscriptionsRepository) : IRequestHandler<SubscribeNewsletterCommand>
{
    public async Task Handle(SubscribeNewsletterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLower();
        logger.LogInformation("Subscribing newsletter email {Email}", email);

        int? customerId = null;
        var user = userContext.GetCurrentUser();
        if (user != null)
        {
            var customer = await customersRepository.GetByUserIdAsync(user.Id);
            customerId = customer?.CustomerId;
        }

        var existingSubscription = await newsletterSubscriptionsRepository.GetByEmailAsync(email);
        if (existingSubscription != null)
        {
            existingSubscription.IsActive = true;
            existingSubscription.UnsubscribedAt = null;
            existingSubscription.CustomerId ??= customerId;
            await newsletterSubscriptionsRepository.UpdateAsync(existingSubscription);
            return;
        }

        await newsletterSubscriptionsRepository.CreateAsync(new NewsletterSubscription
        {
            Email = email,
            CustomerId = customerId,
            IsActive = true
        });
    }
}
