using MediatR;

namespace BookStore.Application.BookImages.Commands.UpdateBookImage;

public class UpdateBookImageCommand : IRequest<bool>
{
    public int ImageId { get; set; } = default;
    public string ImageURL { get; set; } = default!;
    public int ImageOrder { get; set; } = default;
}
