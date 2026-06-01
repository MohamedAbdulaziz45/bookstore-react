using BookStore.Application.Shippings.Dtos;
using MediatR;

namespace BookStore.Application.Shippings.Queries.GetShippingById;

public class GetShippingByIdQuery(int id) : IRequest<ShippingDto>
{
    public int ShippingId { get; } = id;
}
