using BookStore.Application.Users.Commands.AssignUserRole;
using BookStore.Application.Users.Commands.ChangePassword;
using BookStore.Application.Users.Commands.LoginUser;
using BookStore.Application.Users.Commands.RegisterUser;
using BookStore.Application.Users.Commands.UnassignUserRole;
using BookStore.Application.Users.Commands.UpdateUserDetails;
using BookStore.Application.Users.Dtos;
using BookStore.Application.Users.Queries.GetUserDetails;
using BookStore.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/identity")]
public class IdentityController(IMediator mediator) : ControllerBase
{
    [HttpPatch("user")]
    [Authorize]
    public async Task<IActionResult> UpdateUserDetails([FromForm]UpdateUserDetailsCommand command)
    {
        await mediator.Send(command);

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDetailsDto>> GetUserDetails()
    { 
       var result= await mediator.Send(new GetUserDetailsQuery());

        return Ok(result);
    }

    [HttpPost("registerUser")]
    public async Task<ActionResult<string>> RegisterUser(RegisterUserCommand command)
    {
        var token= await mediator.Send(command);
        return Ok(new{token});
    }

    [HttpPost("loginUser")]
    public async Task<ActionResult<string>> Login(LoginUserCommand command)
    {
        var token = await mediator.Send(command);
        return Ok(new { token });
    }

    [HttpPost("userRole")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> AssignUserRole(AssignUserRoleCommand command)
    {
        await mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("userRole")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> UnassignUserRole(UnassignUserRoleCommand command)
    {
        await mediator.Send(command);

        return NoContent();
    }

    [HttpPatch("password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        await mediator.Send(command);
        return NoContent();
    }

}

