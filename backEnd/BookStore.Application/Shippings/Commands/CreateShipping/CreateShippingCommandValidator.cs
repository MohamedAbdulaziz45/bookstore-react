using BookStore.Domain.Constants;
using FluentValidation;
using System;

namespace BookStore.Application.Shippings.Commands.CreateShipping;

public class CreateShippingCommandValidator : AbstractValidator<CreateShippingCommand>
{
    public CreateShippingCommandValidator()
    {
        RuleFor(x => x.CarrierName).NotEmpty().WithMessage("CarrierName is required");
        RuleFor(x => x.TrackingNumber).NotEmpty().WithMessage("TrackingNumber is required");
        RuleFor(x => x.ShippingStatus).IsInEnum().WithMessage("Invalid shipping status.");
        RuleFor(x => x.EstimatedDeliveryDate).NotEmpty().WithMessage("EstimatedDeliveryDate is required");
        RuleFor(x => x.ActualDeliveryDate)
        .NotEmpty()
        .When(x =>x.ShippingStatus== ShippingStatus.Delivered)
        .WithMessage("ActualDeliveryDate is required when shipping is delivered");
        RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("OrderId must be greater than 0");
    }
}
