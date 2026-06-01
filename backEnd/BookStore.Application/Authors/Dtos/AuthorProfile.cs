using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Application.Authors.Commands.CreateAuthor;
using BookStore.Application.Authors.Commands.UpdateAuthor;

namespace BookStore.Application.Authors.Dtos;

public class AuthorProfile : Profile
{
    public AuthorProfile()
    {
        CreateMap<Author, AuthorDto>()
            .ForMember(d => d.BooksCount, o => o.MapFrom(s => s.Books.Count));
        CreateMap<CreateAuthorCommand, Author>();
        CreateMap<UpdateAuthorCommand, Author>();
    }
}
