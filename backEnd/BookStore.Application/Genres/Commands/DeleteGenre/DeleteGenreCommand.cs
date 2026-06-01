using MediatR;

namespace BookStore.Application.Genres.Commands.DeleteGenre;

public class DeleteGenreCommand(int id) : IRequest<bool>
{
    public int GenreId { get; } = id;
}
