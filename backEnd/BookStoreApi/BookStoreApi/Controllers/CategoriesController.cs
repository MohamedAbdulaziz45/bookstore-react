using BookStore.Application.Genres.Commands.CreateGenre;
using BookStore.Application.Genres.Commands.DeleteGenre;
using BookStore.Application.Genres.Commands.UpdateGenre;
using BookStore.Application.Genres.Queries.GetAllGenres;
using BookStore.Application.Genres.Queries.GetGenreById;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/Categories")]
[Authorize]

public class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllGenresQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetGenreByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateGenreCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateGenreCommand command)
    {
        // Ensuring ID in route matches command is handled manually or skipped for brevity
        // Typically: if (id != command.GenreId) return BadRequest();
        command.GenreId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await mediator.Send(new DeleteGenreCommand(id));
        return NoContent();
    }
}
