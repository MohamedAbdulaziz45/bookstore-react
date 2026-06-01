using BookStore.Application.Reviews.Commands.CreateReview;
using BookStore.Application.Reviews.Commands.DeleteReview;
using BookStore.Application.Reviews.Commands.UpdateReview;
using BookStore.Application.Reviews.Queries.GetAllReviews;
using BookStore.Application.Reviews.Queries.GetAllReviewsByBookId;
using BookStore.Application.Reviews.Queries.GetMyReviewByBookId;
using BookStore.Application.Reviews.Queries.GetMyReviews;
using BookStore.Application.Reviews.Queries.GetReviewById;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/reviews")]

[Authorize]
public class ReviewsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllReviewsQuery());
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine()
    {
        var result = await mediator.Send(new GetMyReviewsQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}", Name = "GetReviewById")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await mediator.Send(new GetReviewByIdQuery(id));
        return Ok(result);
    }
    [HttpGet("/api/books/{bookId}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllByBookId([FromRoute] int bookId)
    {
        var result = await mediator.Send(new GetAllReviewsByBookIdQuery(bookId));
        return Ok(result);
    }
    [HttpGet("/api/books/{bookId}/reviews/me")]
    public async Task<IActionResult> GetMyReviewByBookId([FromRoute] int bookId)
    {
        var result = await mediator.Send(new GetMyReviewByBookIdQuery(bookId));
        return Ok(result);
    }
    [HttpPost("/api/books/{bookId}/reviews")]
    public async Task<IActionResult> Create([FromRoute] int bookId, [FromBody] CreateReviewCommand command)
    {
        command.BookId = bookId;
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateReviewCommand command)
    {

        command.ReviewId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await mediator.Send(new DeleteReviewCommand(id));
        return NoContent();
    }
}
