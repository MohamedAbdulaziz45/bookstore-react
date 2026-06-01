using BookStore.Application.Authors.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Authors.Queries.GetAllAuthors;

public class GetAllAuthorsQuery : IRequest<IEnumerable<AuthorDto>>
{
}
