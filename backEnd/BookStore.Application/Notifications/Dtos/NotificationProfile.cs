using AutoMapper;
using BookStore.Domain.Entities;

namespace BookStore.Application.Notifications.Dtos;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        CreateMap<Notification, NotificationDto>();
    }
}

