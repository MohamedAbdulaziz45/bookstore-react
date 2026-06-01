using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Domain.Entities;

public class Author
{
    public int AuthorId { get; set; } 
    public string Name { get; set; } = default!;
    public string Bio { get; set; } = default!;
    public string? Image { get; set; }
    public string? ImagePublicId { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedAt { get; set; }
    public ICollection< Book> Books { get; set; }= new List<Book>();

}
