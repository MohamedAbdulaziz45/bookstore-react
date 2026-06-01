using FluentValidation;

namespace BookStore.Application.Orders.Queries.GetOrderBySessionId;

public class GetOrderBySessionIdQueryValidator : AbstractValidator<GetOrderBySessionIdQuery>
{
    public GetOrderBySessionIdQueryValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty();
    }
}

