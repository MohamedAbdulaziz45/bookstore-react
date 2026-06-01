using MediatR;

namespace BookStore.Application.Newsletter;

public class SubscribeNewsletterCommand : IRequest
{
    public string Email { get; set; } = default!;
}
