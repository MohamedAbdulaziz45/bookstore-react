using BookStore.Application.Services.PaymentService.Stripe;
using BookStore.Application.Orders;
using BookStore.Application.Users;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Commands.CancelOrder;

internal class CancelOrderCommandHandler(
    ILogger<CancelOrderCommandHandler> logger,
    IUserContext userContext,
    ICustomersRepository customersRepository,
    IOrdersRepository ordersRepository,
    INotificationsRepository notificationsRepository,
    IStripeService stripeService) : IRequestHandler<CancelOrderCommand>
{
    public async Task Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Customer cancelling Order {OrderId}", request.OrderId);

        var user = userContext.GetCurrentUser();

        var customer = await customersRepository.GetByUserIdAsync(user.Id)
            ?? throw new NotFoundException("Customer", $"UserId {user.Id} has no associated customer");

        var order = await ordersRepository.GetByIdWithDetailsAsync(request.OrderId)
            ?? throw new NotFoundException(nameof(Order), request.OrderId.ToString());

        if (order.CustomerId != customer.CustomerId)
            throw new ForbidException();

        if (!OrderStatusTransitionPolicy.CanCustomerCancel(order.Status))
            throw new BadRequestException("Only pending orders can be cancelled.");

        if (!string.IsNullOrEmpty(order.Payment?.StripePaymentIntentId))
        {
            await stripeService.RefundPaymentAsync(
                order.Payment.StripePaymentIntentId,
                $"order_cancel_{order.OrderId}",
                cancellationToken);
        }

        await ordersRepository.UpdateStatusAsync(order.OrderId, OrderStatus.Cancelled);

        await notificationsRepository.CreateAsync(new Notification
        {
            CustomerId = customer.CustomerId,
            Title = $"Order #{order.OrderId} cancelled",
            Message = "Your order was cancelled successfully.",
            Type = "OrderCancelled",
            LinkUrl = $"/orders/{order.OrderId}",
            IsRead = false
        });
    }
}
