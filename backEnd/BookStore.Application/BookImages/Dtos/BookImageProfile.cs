using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Application.BookImages.Commands.CreateBookImage;
using BookStore.Application.BookImages.Commands.UpdateBookImage;

namespace BookStore.Application.BookImages.Dtos;

public class BookImageProfile : Profile
{
    public BookImageProfile()
    {
        CreateMap<BookImage, BookImageDto>();
        CreateMap<CreateBookImageCommand, BookImage>();
        CreateMap<UpdateBookImageCommand, BookImage>();
    }
}
