using MediatR;

namespace BookStore.Application.BookImages.Commands.CreateBookImage;

public class CreateBookImageCommand : IRequest<int>
{
    public int ImageId { get; set; } = default;
    public string ImageURL { get; set; } = default!;
    public int ImageOrder { get; set; } = default;
}
