using BookStore.Application.Home;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController(IMediator mediator) : ControllerBase
    {
        [HttpGet("spotlight")]
        public async Task<ActionResult<HomeSpotlightDto>> GetSpotlight()
        {
            var result = await mediator.Send(new GetHomeSpotlightQuery());
            return Ok(result);
        }
    }
}
