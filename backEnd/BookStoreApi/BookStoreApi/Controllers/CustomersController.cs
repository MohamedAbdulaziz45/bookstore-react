using BookStore.Application.Customers.Commands.CreateCustomer;
using BookStore.Application.Customers.Commands.DeleteCustomer;
using BookStore.Application.Customers.Commands.UpdateCustomer;
using BookStore.Application.Customers.Queries.GetAllCustomers;
using BookStore.Application.Customers.Queries.GetCustomerById;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize(Roles = UserRoles.Admin)]
public class CustomersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllCustomersQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetCustomerByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCustomerCommand command)
    {
        // Ensuring ID in route matches command is handled manually or skipped for brevity
        // Typically: if (id != command.CustomerId) return BadRequest();
        command.CustomerId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<IActionResult> Deactivate([FromRoute] int id)
    {
        await mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }
}
