using BookStore.Application.Carts.Commands.AddOrUpdateCartItem;
using BookStore.Application.Carts.Commands.ClearCart;
using BookStore.Application.Carts.Commands.DeleteCartItem;
using BookStore.Application.Carts.Commands.SyncCartItem;
using BookStore.Application.Carts.Dtos;
using BookStore.Application.Carts.Queries.GetCart;
using BookStore.Application.Carts.Queries.PreviewCart;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/carts")]
    [ApiController]
    [Authorize]
    public class CartsController(IMediator mediator) : ControllerBase
    {


        [HttpGet("me")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCart()
        {
            var result = await mediator.Send(new GetCartQuery());
            return Ok(result);
        }

        [HttpPost("items")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CartDto>> AddOrUpdateItem
        ([FromBody]AddOrUpdateCartItemCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("items/{bookId:int}")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> RemoveItem(int bookId)
        {
           var cart =  await mediator.Send(new DeleteCartItemCommand(bookId));
            return Ok(cart);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult>ClearCart()
        {
            await mediator.Send(new ClearCartCommand());
            return NoContent();
        }

        [HttpPost("sync")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CartDto>> SyncCart([FromBody]SyncCartCommand command)
        {
            var cart = await mediator.Send(command);
            return Ok(cart);
        }

        [HttpPost("preview")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CartDto>> GetCartPreview([FromBody] PreviewCartQuery query)
        {
            var cart = await mediator.Send(query);
            return Ok(cart);
        }
    }
}
