using BookStore.Application.Shippings.Commands.CreateShipping;

using BookStore.Application.Shippings.Commands.UpdateShipping;
using BookStore.Application.Shippings.Queries.GetAllShippings;
using BookStore.Application.Shippings.Queries.GetShippingById;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/shippings")]
[Authorize]
public class ShippingsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllShippingsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetShippingByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateShippingCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateShippingCommand command)
    {

        command.ShippingId = id;
        await mediator.Send(command);
        return NoContent();
    }

}
