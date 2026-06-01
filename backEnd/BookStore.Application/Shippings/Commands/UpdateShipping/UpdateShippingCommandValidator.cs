using BookStore.Domain.Constants;
using FluentValidation;

namespace BookStore.Application.Shippings.Commands.UpdateShipping;

public class UpdateShippingCommandValidator : AbstractValidator<UpdateShippingCommand>
{
    public UpdateShippingCommandValidator()
    {
        RuleFor(x => x.ShippingId).GreaterThan(0).WithMessage("ShippingId must be greater than 0");
        RuleFor(x => x.CarrierName).NotEmpty().WithMessage("CarrierName is required");
        RuleFor(x => x.TrackingNumber).NotEmpty().WithMessage("TrackingNumber is required");
        RuleFor(x => x.ShippingStatus).NotEmpty().WithMessage("ShippingStatus is required");
        RuleFor(x => x.EstimatedDeliveryDate).NotEmpty().WithMessage("EstimatedDeliveryDate is required");
        RuleFor(x => x.ActualDeliveryDate)
        .NotEmpty()
        .When(x => x.ShippingStatus == ShippingStatus.Delivered)
        .WithMessage("ActualDeliveryDate is required when shipping is delivered");
    }
}
