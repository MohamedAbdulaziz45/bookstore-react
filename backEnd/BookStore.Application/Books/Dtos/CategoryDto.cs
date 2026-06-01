using System.Text.Json.Serialization;

namespace BookStore.Application.Books.Dtos;

public class CategoryDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
}