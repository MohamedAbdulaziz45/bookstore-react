using BookStore.Application.Addresses.Commands.CreateAddress;
using BookStore.Application.Addresses.Commands.DeleteAddress;
using BookStore.Application.Addresses.Commands.SetDefaultAddress;
using BookStore.Application.Addresses.Commands.UpdateAddress;
using BookStore.Application.Addresses.Dtos;
using BookStore.Application.Addresses.Queries.GetMyAddresses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/addresses")]
    [ApiController]
    [Authorize]
    public class AddressesController(IMediator mediator) : ControllerBase
    {

        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetMine()
        {
            return Ok(await mediator.Send(new GetMyAddressesQuery()));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateAddressCommand command)
        {
            var id = await mediator.Send(command);
            return CreatedAtAction(nameof(GetMine), new { id }, new {addressId=id});
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateAddressCommand command)
        {
            command.AddressId = id;
            await mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await mediator.Send(new DeleteAddressCommand(id));
            return NoContent();
        }

        [HttpPatch("{id}/default")]
        public async Task<IActionResult> SetDefault(int id)
        {
            await mediator.Send(new SetDefaultAddressCommand(id));
            return NoContent();
        }
    }
}
