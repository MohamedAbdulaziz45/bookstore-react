using MediatR;

namespace BookStore.Application.BookImages.Commands.DeleteBookImage;

public class DeleteBookImageCommand(int id) : IRequest<bool>
{
    public int ImageId { get; } = id;
}
