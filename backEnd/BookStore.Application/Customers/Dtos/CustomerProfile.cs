using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Application.Customers.Commands.CreateCustomer;
using BookStore.Application.Customers.Commands.UpdateCustomer;

namespace BookStore.Application.Customers.Dtos;

public class CustomerProfile : Profile
{
    public CustomerProfile()
    {
        CreateMap<Customer, CustomerDto>();
        CreateMap<CreateCustomerCommand, Customer>();
        CreateMap<UpdateCustomerCommand, Customer>();
    }
}
