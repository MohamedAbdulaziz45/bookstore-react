
using BookStore.Application.Payments.Queries.GetAllPayments;
using BookStore.Application.Payments.Queries.GetPaymentByOrderId;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetAll()
        => Ok(await mediator.Send(new GetAllPaymentsQuery()));

    [HttpGet("order/{orderId:int}")]
    public async Task<IActionResult> GetByOrderId([FromRoute] int orderId)
        => Ok(await mediator.Send(new GetPaymentByOrderIdQuery(orderId)));
}
