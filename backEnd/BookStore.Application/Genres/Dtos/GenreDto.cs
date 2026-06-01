namespace BookStore.Application.Genres.Dtos;

public class GenreDto
{
    public int GenreId { get; set; } = default;
    public string GenreName { get; set; } = default!;
    public string? ImgUrl { get; set; }
    public int Count { get; set; }
}
