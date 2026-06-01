using BookStore.Application.Notifications.Commands.MarkAllNotificationsAsRead;
using BookStore.Application.Notifications.Commands.MarkNotificationAsRead;
using BookStore.Application.Notifications.Queries.GetMyNotifications;
using BookStore.Application.Notifications.Queries.GetMyUnreadNotificationsCount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationsController(IMediator mediator) : ControllerBase
    {

        [HttpGet("me")]
        public async Task<IActionResult> GetMine()
        { 
           return Ok(await mediator.Send(new GetMyNotificationsQuery()));
        }


        [HttpGet("me/unread-count")]
        public async Task<IActionResult> GetMyUnreadCount()
        { 
          return Ok(new { unreadCount = await mediator.Send(new GetMyUnreadNotificationsCountQuery()) });
        }

        [HttpPatch("{id:int}/read")]
        public async Task<IActionResult> MarkRead([FromRoute] int id)
        {
            await mediator.Send(new MarkNotificationAsReadCommand(id));
            return NoContent();
        }
        [HttpPatch("me/read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            await mediator.Send(new MarkAllNotificationsAsReadCommand());
            return NoContent();
        }
    }
}
