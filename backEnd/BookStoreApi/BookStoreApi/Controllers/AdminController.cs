using BookStore.Application.Admin.Queries.GetAdminDashboardSummary;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = UserRoles.Admin)]
public class AdminController(IMediator mediator) : ControllerBase
{
    [HttpGet("dashboard-summary")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var result = await mediator.Send(new GetAdminDashboardSummaryQuery());
        return Ok(result);
    }
}
