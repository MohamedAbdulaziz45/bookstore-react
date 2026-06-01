using FluentValidation;

namespace BookStore.Application.Payments.Queries.GetPaymentByOrderId;

public class GetPaymentByOrderIdQueryValidator : AbstractValidator<GetPaymentByOrderIdQuery>
{
    public GetPaymentByOrderIdQueryValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0);
    }
}

