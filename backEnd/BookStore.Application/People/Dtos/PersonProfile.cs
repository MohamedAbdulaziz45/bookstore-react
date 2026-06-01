using AutoMapper;
using BookStore.Domain.Entities;

namespace BookStore.Application.People.Dtos;

public class PersonProfile : Profile
{
    public PersonProfile()
    {
        CreateMap<Person, PersonDto>();
    }
}
