using BookStore.Application.Checkout.Dtos;
using MediatR;

namespace BookStore.Application.Checkout.Commands.CreateCheckoutSession;

public class CreateCheckoutSessionCommand : IRequest<CreateCheckoutSessionResult>
{
    public int ShippingAddressId { get; set; }
}
