namespace BookStore.Application.Reviews.Dtos;

public class ReviewDto
{
    public int ReviewId { get; set; } = default;
    public string ReviewText { get; set; } = default!;
    public int Rating { get; set; } = default;
    public DateTime ReviewDate { get; set; } = default;
    public int BookId { get; set; } = default;
    public int CustomerId { get; set; } = default;
}
