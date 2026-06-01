using BookStore.Application.Shippings.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Shippings.Queries.GetAllShippings;

public class GetAllShippingsQuery : IRequest<IEnumerable<ShippingDto>>
{
}
