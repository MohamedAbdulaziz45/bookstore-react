using BookStore.Application.Books.Commands.CreateBook;
using BookStore.Application.Books.Commands.DeleteBook;
using BookStore.Application.Books.Commands.UpdateBook;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Books.Queries.GetAdminBooks;
using BookStore.Application.Books.Queries.GetAllBooks;
using BookStore.Application.Books.Queries.GetAllByGenre;
using BookStore.Application.Books.Queries.GetBookById;
using BookStore.Application.Books.Queries.GetEditorsPicks;
using BookStore.Application.Books.Queries.GetFeaturBooks;
using BookStore.Application.Common;
using BookStore.Domain.Views;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<MiniBookDto>>> GetAll([FromQuery] GetAllBooksQuery query)
    {
        var books = await mediator.Send(query);
        return Ok(books);
    }
    [HttpGet("featured")]
    public async Task<ActionResult<PagedResult<MiniBookDto>>> GetFeatured([FromQuery] GetFeaturedBooksQuery query)
    {
        var books = await mediator.Send(query);
        return Ok(books);
    }

    [HttpGet("editors-picks")]
    public async Task<ActionResult<PagedResult<MiniBookDto>>> GetEditorsPicks([FromQuery] GetEditorsPicksQuery query)
    {
        var books = await mediator.Send(query);
        return Ok(books);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedResult<AdminBookDto>>> GetAdminBooks([FromQuery] GetAdminBooksQuery query)
    {
        var books = await mediator.Send(query);
        return Ok(books);
    }
    [HttpGet("genre/{Genreid:int}")]
    public async Task<ActionResult<PagedResult<MiniBookDto>>> GetAllByGenreId(
    [FromQuery] GetAllByGenreQuery query)
    {
        var books = await mediator.Send(query);
        return Ok(books);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetBookByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateBookCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromForm] UpdateBookCommand command)
    {
        // Ensuring ID in route matches command is handled manually or skipped for brevity
        // Typically: if (id != command.BookId) return BadRequest();
        command.BookId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await mediator.Send(new DeleteBookCommand(id));
        return NoContent();
    }
}
