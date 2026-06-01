using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Newsletter;

internal class UnsubscribeNewsletterCommandHandler(
    ILogger<UnsubscribeNewsletterCommandHandler> logger,
    INewsletterSubscriptionsRepository newsletterSubscriptionsRepository) : IRequestHandler<UnsubscribeNewsletterCommand>
{
    public async Task Handle(UnsubscribeNewsletterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLower();
        logger.LogInformation("Unsubscribing newsletter email {Email}", email);

        var existingSubscription = await newsletterSubscriptionsRepository.GetByEmailAsync(email);
        if (existingSubscription == null || !existingSubscription.IsActive)
            return;

        existingSubscription.IsActive = false;
        existingSubscription.UnsubscribedAt = DateTime.UtcNow;
        await newsletterSubscriptionsRepository.UpdateAsync(existingSubscription);
    }
}
