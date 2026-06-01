using BookStore.Application.Authors.Commands.CreateAuthor;
using BookStore.Application.Authors.Commands.DeleteAuthor;
using BookStore.Application.Authors.Commands.FeatureAuthor;
using BookStore.Application.Authors.Commands.UnfeatureAuthor;
using BookStore.Application.Authors.Commands.UpdateAuthor;
using BookStore.Application.Authors.Queries.GetAllAuthors;
using BookStore.Application.Authors.Queries.GetAuthorBooks;
using BookStore.Application.Authors.Queries.GetAuthorById;
using BookStore.Application.Authors.Queries.GetFeaturedAuthor;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/authors")]
public class AuthorsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllAuthorsQuery());
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var result = await mediator.Send(new GetFeaturedAuthorQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetAuthorByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("{id:int}/books")]
    public async Task<IActionResult> GetBooks([FromRoute] int id, [FromQuery] GetAuthorBooksRequest request)
    {
        var result = await mediator.Send(new GetAuthorBooksQuery(id)
        {
            SearchPhrase = request.SearchPhrase,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            SortBy = request.SortBy,
            SortDirection = request.SortDirection
        });

        return Ok(result);
    }

    [HttpPatch("{id:int}/feature")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Feature(int id)
    {
        await mediator.Send(new FeatureAuthorCommand(id));
        return NoContent();
    }

    [HttpPatch("{id:int}/unfeature")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Unfeature(int id)
    {
        await mediator.Send(new UnfeatureAuthorCommand(id));
        return NoContent();
    }
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateAuthorCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromForm] UpdateAuthorCommand command)
    {
        if (id != command.AuthorId) return BadRequest();
        command.AuthorId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await mediator.Send(new DeleteAuthorCommand { AuthorId = id });
        return NoContent();
    }
}

public class GetAuthorBooksRequest
{
    public string? SearchPhrase { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 4;
    public string? SortBy { get; init; }
    public SortDirection SortDirection { get; init; } = SortDirection.Ascending;
}
