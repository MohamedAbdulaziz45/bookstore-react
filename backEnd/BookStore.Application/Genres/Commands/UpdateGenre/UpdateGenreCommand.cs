using MediatR;

namespace BookStore.Application.Genres.Commands.UpdateGenre;

public class UpdateGenreCommand : IRequest<bool>
{
    public int GenreId { get; set; } = default;
    public string GenreName { get; set; } = default!;
}
