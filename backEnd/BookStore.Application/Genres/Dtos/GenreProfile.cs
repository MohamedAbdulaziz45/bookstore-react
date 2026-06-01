using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Application.Genres.Commands.CreateGenre;
using BookStore.Application.Genres.Commands.UpdateGenre;
using BookStore.Domain.Views;

namespace BookStore.Application.Genres.Dtos;

public class GenreProfile : Profile
{
    public GenreProfile()
    {
        CreateMap<Category, GenreDto>();
        CreateMap<GenreView, GenreDto>();
        CreateMap<CreateGenreCommand, Category>();
        CreateMap<UpdateGenreCommand, Category>();
    }
}
