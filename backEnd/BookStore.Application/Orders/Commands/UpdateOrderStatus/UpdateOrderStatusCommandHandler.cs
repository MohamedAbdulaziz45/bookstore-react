using BookStore.Application.Services.PaymentService.Stripe;
using BookStore.Application.Orders;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Orders.Commands.UpdateOrderStatus;

internal class UpdateOrderStatusCommandHandler(
    ILogger<UpdateOrderStatusCommandHandler> logger,
    IOrdersRepository ordersRepository,
    INotificationsRepository notificationsRepository,
    IStripeService stripeService) : IRequestHandler<UpdateOrderStatusCommand>
{
    public async Task Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Admin updating Order {OrderId} status to {Status}", request.OrderId, request.NewStatus);

        var order = await ordersRepository.GetByIdWithDetailsAsync(request.OrderId)
            ?? throw new NotFoundException(nameof(Order), request.OrderId.ToString());

        if (!OrderStatusTransitionPolicy.CanAdminTransition(order.Status, request.NewStatus))
        {
            throw new BadRequestException(
                $"Invalid status transition from {order.Status} to {request.NewStatus}.");
        }

        if (order.Status == OrderStatus.Processing
            && request.NewStatus == OrderStatus.Shipped
            && !OrderStatusTransitionPolicy.HasRequiredShippingInfo(order))
        {
            throw new BadRequestException(
                "Shipping carrier, tracking number, and a non-pending shipping status are required before marking an order as shipped.");
        }

        if (request.NewStatus == OrderStatus.Cancelled
            && !string.IsNullOrEmpty(order.Payment?.StripePaymentIntentId))
        {
            await stripeService.RefundPaymentAsync(
                order.Payment.StripePaymentIntentId,
                $"admin_order_cancel_{order.OrderId}",
                cancellationToken);
        }

        await ordersRepository.UpdateStatusAsync(order.OrderId, request.NewStatus);

        await notificationsRepository.CreateAsync(new Notification
        {
            CustomerId = order.CustomerId,
            Title = $"Order #{order.OrderId} status updated",
            Message = $"Your order status changed to {request.NewStatus}.",
            Type = "OrderStatusChanged",
            LinkUrl = $"/orders/{order.OrderId}",
            IsRead = false
        });
    }

}
