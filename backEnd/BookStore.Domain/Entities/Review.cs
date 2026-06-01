using System;

namespace BookStore.Domain.Entities;

public class Review
{
    public int ReviewId { get; set; }
    public string ReviewText { get; set; } = default!;
    public int Rating { get; set; }
    public DateTime ReviewDate { get; set; } = DateTime.UtcNow;


    public int BookId { get; set; }
    public Book? Book { get; set; }

    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
}
