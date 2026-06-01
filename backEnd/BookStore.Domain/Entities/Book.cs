using System;
using System.Collections.Generic;

namespace BookStore.Domain.Entities;

public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; } = default!;
    public string ISBN { get; set; } = default!;
    public DateTime PublicationDate { get; set; }
    public string? AdditionalDetails { get; set; }
    public decimal Price { get; set; }
    public int QuantityInStock { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedAt { get; set; }
    public bool IsEditorsPick { get; set; }
    public DateTime? EditorsPickAt { get; set; }
    public int AuthorId{  get; set; }


    public int? ImageId { get; set; }
    public BookImage? BookImage { get; set; }

    public Author Author { get; set; }=default!;
    public ICollection<BookGenre> BookGenres { get; set; } = new List<BookGenre>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
