using BookStore.Application.Authors.Dtos;
using MediatR;

namespace BookStore.Application.Authors.Queries.GetAuthorById;

public class GetAuthorByIdQuery(int id) : IRequest<AuthorDto>
{
    public int Id { get; } = id;
}
