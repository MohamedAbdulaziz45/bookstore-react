namespace BookStore.Application.BookImages.Dtos;

public class BookImageDto
{
    public int ImageId { get; set; } = default;
    public string ImageURL { get; set; } = default!;
    public int ImageOrder { get; set; } = default;
}
