using System.Collections.Generic;

namespace BookStore.Domain.Entities;

public class BookImage
{
    public int ImageId { get; set; }
    public string ImageURL { get; set; } = default!;
    public string? PublicId { get; set; }


    public Book? Book { get; set; }
}
