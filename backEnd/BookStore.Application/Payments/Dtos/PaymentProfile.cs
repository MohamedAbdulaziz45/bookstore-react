using AutoMapper;
using BookStore.Domain.Entities;


namespace BookStore.Application.Payments.Dtos;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<Payment, PaymentDto>();

    }
}
