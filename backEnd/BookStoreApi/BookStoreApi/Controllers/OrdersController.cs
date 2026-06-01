
using BookStore.Application.Orders.Commands.CancelOrder;
using BookStore.Application.Orders.Commands.UpdateOrderStatus;
using BookStore.Application.Orders.Queries.GetAllOrders;
using BookStore.Application.Orders.Queries.GetMyOrders;
using BookStore.Application.Orders.Queries.GetMyOrderSummary;
using BookStore.Application.Orders.Queries.GetOrderById;
using BookStore.Application.Orders.Queries.GetOrderBySessionId;
using BookStore.Domain.Constants;
using CloudinaryDotNet.Actions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllOrdersQuery());
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyOrders()
    {
       return  Ok(await mediator.Send(new GetMyOrdersQuery()));
    }

    [HttpGet("me/summary")]
    public async Task<IActionResult> GetMyOrderSummary()
    {
        return Ok(await mediator.Send(new GetMyOrderSummaryQuery()));
    }
    [HttpGet("by-session/{sessionId}")]
    public async Task<IActionResult> GetBySessionId([FromRoute] string sessionId)
    {
        return Ok(await mediator.Send(new GetOrderBySessionIdQuery(sessionId)));
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetOrderByIdQuery(id));
        return Ok(result);
    }
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] UpdateOrderStatusCommand command)
    {
        command.OrderId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel([FromRoute] int id)
    {
        await mediator.Send(new CancelOrderCommand(id));
        return NoContent();
    }

}
