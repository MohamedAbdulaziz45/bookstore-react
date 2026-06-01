using BookStore.Application.Newsletter;
using MediatR;

using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/newsletter")]
public class NewsletterController(IMediator mediator) : ControllerBase
{
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeNewsletterCommand command)
    {
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPost("unsubscribe")]
    public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeNewsletterCommand command)
    {
        await mediator.Send(command);
        return NoContent();
    }


}
