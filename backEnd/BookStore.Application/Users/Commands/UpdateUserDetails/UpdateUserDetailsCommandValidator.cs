using FluentValidation;

namespace BookStore.Application.Users.Commands.UpdateUserDetails;

public class UpdateUserDetailsCommandValidator : AbstractValidator<UpdateUserDetailsCommand>
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    public UpdateUserDetailsCommandValidator()
    {
        RuleFor(x => x.FirstName)
             .MinimumLength(2).WithMessage("First name must be at least 2 characters")
             .MaximumLength(50).WithMessage("First name cannot exceed 50 characters")
             .When(x => x.FirstName != null);

        RuleFor(x => x.LastName)
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters")
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters")
            .When(x => x.LastName != null);

        RuleFor(x => x.Address)
            .MinimumLength(10).WithMessage("Address must be at least 10 characters")
            .MaximumLength(250).WithMessage("Address cannot exceed 250 characters")
            .When(x => x.Address != null);



        When(x => x.Image != null, () =>
        {
            RuleFor(x => x.Image!.Length)
                .LessThanOrEqualTo(MaxFileSizeBytes)
                .WithMessage("Image must not exceed 5MB.");

            RuleFor(x => x.Image!.ContentType)
                .Must(ct => ct.StartsWith("image/"))
                .WithMessage("File must be an image.");

            RuleFor(x => x.Image!.FileName)
                .Must(fn => AllowedExtensions.Contains(Path.GetExtension(fn).ToLower()))
                .WithMessage("Allowed formats: jpg, jpeg, png, webp.");
        });
    }
}
