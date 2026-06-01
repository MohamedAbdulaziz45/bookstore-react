using AutoMapper;
using BookStore.Application.Books.Commands.CreateBook;
using BookStore.Application.Books.Commands.UpdateBook;
using BookStore.Domain.Entities;
using BookStore.Domain.Views;
using System.Text.Json;

namespace BookStore.Application.Books.Dtos;

public class BookProfile : Profile
{
    public BookProfile()
    {
        CreateMap<Book, BookDto>();
        CreateMap<BookView, BookViewDto>()
         .ForMember(dest => dest.Categories,
               opt => opt.MapFrom<CategoriesJsonResolver>());
        CreateMap<MiniBookView, MiniBookDto>();
        CreateMap<CreateBookCommand, Book>();
        CreateMap<UpdateBookCommand, Book>();
    }
}
public class CategoriesJsonResolver : IValueResolver<BookView, BookViewDto, List<CategoryDto>>
{
    public List<CategoryDto> Resolve(BookView source, BookViewDto destination, List<CategoryDto> destMember, ResolutionContext context)
    {
        if (string.IsNullOrWhiteSpace(source.CategoriesJson))
            return [];

;

        return JsonSerializer.Deserialize<List<CategoryDto>>(source.CategoriesJson) ?? [];
    }
}