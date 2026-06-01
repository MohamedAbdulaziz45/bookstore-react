using MediatR;

namespace BookStore.Application.Newsletter;

public class UnsubscribeNewsletterCommand : IRequest
{
    public string Email { get; set; } = default!;
}
