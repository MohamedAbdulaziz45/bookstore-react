using MediatR;

namespace BookStore.Application.Genres.Commands.CreateGenre;

public class CreateGenreCommand : IRequest<int>
{
    public string GenreName { get; set; } = default!;
}
