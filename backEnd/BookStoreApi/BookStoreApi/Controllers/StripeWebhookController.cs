using BookStore.Application.Checkout.Commands.ExpireCheckout;
using BookStore.Application.Checkout.Commands.FulfillCheckout;
using BookStore.Application.Services.PaymentService.Stripe;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using static BookStore.Application.Services.PaymentService.Contracts.StripeDtos;

namespace BookStoreApi.Controllers
{
    [Route("api/webhooks")]
    [ApiController]
    public class StripeWebhookController(
    IMediator mediator,
    IStripeService stripeService,
    ILogger<StripeWebhookController> logger) : ControllerBase
    {

       [HttpPost("stripe")]
       [AllowAnonymous]
       public async Task<IActionResult> Handle()
       {
            string payload;
            using (var reader = new StreamReader(Request.Body))
            {
                payload = await reader.ReadToEndAsync();
            }

            var signature = Request.Headers["Stripe-Signature"].ToString();
            if (string.IsNullOrWhiteSpace(signature))
            {
                logger.LogWarning("Stripe webhook rejected because Stripe-Signature header is missing.");
                return BadRequest("Missing Stripe-Signature header.");
            }

            StripeWebhookEventDto stripeEvent;
            try
            {
                stripeEvent = stripeService.ConstructWebhookEvent(payload, signature);

            }
            catch (StripeException ex)
            {
                logger.LogWarning(ex, "Stripe webhook rejected due to invalid signature.");
                return BadRequest("Invalid Stripe webhook signature.");
            }

            if (stripeEvent.EventType == "checkout.session.completed" &&
                stripeEvent.PaymentStatus == "paid" &&
                stripeEvent.SessionId is not null)
            {
                await mediator.Send(new FulfillCheckoutCommand
                {
                    EventId = stripeEvent.EventId,
                    EventType = stripeEvent.EventType,
                    StripeSessionId = stripeEvent.SessionId,
                    StripePaymentIntentId = stripeEvent.PaymentIntentId,
                    StripeCustomerId = stripeEvent.CustomerId,
                    AmountTotalMinorUnits = stripeEvent.AmountTotalMinorUnits,
                    Currency = stripeEvent.Currency
                });
            }
            else if (stripeEvent.EventType == "checkout.session.expired" &&
             
            
            
            stripeEvent.SessionId is not null)
            {
                await mediator.Send(new ExpireCheckoutCommand
                {
                    EventId = stripeEvent.EventId,
                    EventType = stripeEvent.EventType,
                    StripeSessionId = stripeEvent.SessionId
                });
            }

            return Ok();
        }
    }
}
