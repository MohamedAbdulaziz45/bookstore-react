using Microsoft.AspNetCore.Http;

namespace BookStore.Application.Common.Interface;

public interface ICloudinaryService
{
    Task<CloudinaryUploadResult> UploadImageAsync(IFormFile file, string folder = "bookworms/books");
    Task DeleteImageAsync(string publicId);
}
