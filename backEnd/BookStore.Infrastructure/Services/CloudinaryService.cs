using BookStore.Application.Common;
using BookStore.Application.Common.Interface;
using BookStore.Application.Common.Settings;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    public CloudinaryService(IOptions<CloudinarySettings>config){
        var acc = new Account(
        config.Value.CloudName,
        config.Value.ApiKey,
        config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(acc);
    }
    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(IFormFile file, string folder = "bookworms/books")
    {
        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
          File= new FileDescription(file.FileName,stream),
          Folder = folder,
          Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);
        if (result.Error != null)
            throw new Exception(result.Error.Message);

        return new CloudinaryUploadResult(result.SecureUrl.ToString(),result.PublicId);
    }
}
