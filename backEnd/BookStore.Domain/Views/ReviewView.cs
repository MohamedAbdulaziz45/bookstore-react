
namespace BookStore.Domain.Views;

public class ReviewView
{
    public int ReviewId { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string ReviewText { get; set; } = default!;
    public int Rating { get; set; } = default;
    public DateTime ReviewDate { get; set; } = default;
    public int BookId { get; set; } = default;
    public string UserId { get; set; } = default!;
}
