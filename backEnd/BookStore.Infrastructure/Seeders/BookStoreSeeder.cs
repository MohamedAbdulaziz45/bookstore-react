using BookStore.Domain.Entities;
using BookStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;

namespace BookStore.Infrastructure.Seeders;

internal class BookStoreSeeder(BookStoreDBContext dbContext) : IBookStoreSeeder
{
    public async Task Seed()
    {
        if (await dbContext.Database.CanConnectAsync())
        {

            if (!dbContext.Roles.Any())
            {
                var roles = GetRoles();
                dbContext.Roles.AddRange(roles);

                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.People.Any())
            {
                var people = GetPeople();
                dbContext.People.AddRange(people);

                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Genres.Any())
            {
                dbContext.Genres.AddRange(GetGenres());
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Authors.Any())
            {
                dbContext.Authors.AddRange(GetAuthors());
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.BookImages.Any())
            {
                dbContext.BookImages.AddRange(GetBookImages());
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Books.Any())
            {
                dbContext.Books.AddRange(GetBooks());
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.BookGenres.Any())
            {
                dbContext.BookGenres.AddRange(GetBookGenres());
                await dbContext.SaveChangesAsync();
            }
        }
    }

    private IEnumerable<Person> GetPeople()
    {
        List<Person> people =
        [
            new()
            {
               NationalNo="N1",
               FirstName="Mohammed",
               SecondName="Admin",
               LastName="Admin",
               DateOfBirth= new DateTime(2000,1,1),
               Gender=1,
               Address="Egypt",

            }
        ];

        return people;
    }

    private IEnumerable<IdentityRole> GetRoles()
    {
        List<IdentityRole> roles =
        [
            new("Admin")
            {
               NormalizedName = "ADMIN"
            },
            new("User")
            {
               NormalizedName = "USER"
            }
        ];

        return roles;
    }


    private IEnumerable<Author> GetAuthors()
    {
        return
        [
        new() { Name = "John Roberts",    Bio = "Bestselling author of science fiction and fantasy novels.",           Image = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
        new() { Name = "Grace Bryant",    Bio = "Award-winning writer known for her vivid storytelling.",              Image = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" },
        new() { Name = "Kathryn Moris",   Bio = "Author of several bestselling thriller novels.",                     Image = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop" },
        new() { Name = "Mark Brown",      Bio = "Celebrated author with over 20 years of writing experience.",        Image = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop" },
        new() { Name = "Alex Turner",     Bio = "Young adult fiction writer and creative writing teacher.",           Image = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
        new() { Name = "Sarah Connor",    Bio = "Mystery and suspense novelist with a passion for dark themes.",      Image = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop" },
        new() { Name = "Jon Krakauer",    Bio = "Non-fiction writer known for adventure and wilderness stories.",     Image = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop" },
        new() { Name = "Wiley Cash",      Bio = "Southern fiction writer and university professor.",                  Image = "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop" },
        new() { Name = "Elena Marsh",     Bio = "Romance and drama novelist with a loyal global fanbase.",            Image = "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop" },
        new() { Name = "David Hale",      Bio = "Crime fiction writer and former detective.",                         Image = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop" },
        new() { Name = "Olivia Stone",    Bio = "Contemporary fiction author exploring family and identity.",         Image = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop" },
        new() { Name = "Nathan Cole",     Bio = "Historical fiction writer with a focus on ancient civilizations.",   Image = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop" },
    ];
    }

    private IEnumerable<Category> GetGenres()
    {
        return
        [
        new() { GenreName = "Religion",  ImgUrl = "https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop" },
        new() { GenreName = "Young Adult",       ImgUrl = "https://images.unsplash.com/photo-1495446815901-a7297e3eda00?w=600&h=400&fit=crop" },
        new() { GenreName = "Fiction",     ImgUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop" },
        new() { GenreName = "Crime & Suspense",         ImgUrl = "https://images.unsplash.com/photo-1543002588-d83cdf1d3f90?w=600&h=400&fit=crop"},
        new() { GenreName = "Biographies",    ImgUrl = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop"},
        new() { GenreName = "Mystery & Thriller",       ImgUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop" },
        new() { GenreName = "Science Fiction",          ImgUrl = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop" },
        new() { GenreName = "History",                  ImgUrl = "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&h=400&fit=crop" },
        new() { GenreName = "Self Help",                ImgUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop" },
        new() {  GenreName = "Romance",                 ImgUrl = "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=400&fit=crop" },
    ];
    }

    private IEnumerable<BookImage> GetBookImages()
    {
        return
        [
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739161-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091016-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739176-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228662-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314135-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775074-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739180-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228700-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091024-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739190-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775080-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228710-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314140-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739200-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091030-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228720-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775090-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739210-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314150-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228730-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091040-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775100-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739220-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314160-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228740-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091050-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775110-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739230-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314170-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228750-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091060-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775120-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739240-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314180-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228760-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091070-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775130-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739250-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314190-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228770-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091080-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775140-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739260-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314200-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228780-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091090-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775150-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739270-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314210-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228790-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091100-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775160-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739280-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314220-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8228800-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8091110-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8775170-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8739290-L.jpg" },
        new() {  ImageURL = "https://covers.openlibrary.org/b/id/8314230-L.jpg" },
    ];
    }

    private IEnumerable<Book> GetBooks()
    {
        return
        [
        new() { Title = "Cyber Angel",             ISBN = "978-1-001-00001-1", PublicationDate = new DateTime(2022, 1,  15), Price = 18.50m, QuantityInStock = 50, AuthorId = 1,  ImageId = 1,  AdditionalDetails = "A thrilling journey through a digital world where angels and machines collide." },
    new() { Title = "Ark Forging",             ISBN = "978-1-001-00002-2", PublicationDate = new DateTime(2021, 5,  20), Price = 20.00m, QuantityInStock = 35, AuthorId = 1,  ImageId = 2,  AdditionalDetails = "An epic tale of faith, survival, and the forging of destiny." },
    new() { Title = "2024 Sanctuary",          ISBN = "978-1-001-00003-3", PublicationDate = new DateTime(2024, 1,  1),  Price = 17.00m, QuantityInStock = 60, AuthorId = 1,  ImageId = 3,  AdditionalDetails = "A young adult story set in a future world seeking peace and refuge." },
    new() { Title = "Feugiat Maecenas",        ISBN = "978-1-001-00004-4", PublicationDate = new DateTime(2020, 8,  10), Price = 14.00m, QuantityInStock = 40, AuthorId = 2,  ImageId = 4,  AdditionalDetails = "A memoir of resilience and triumph against all odds." },
    new() { Title = "Liar of Dreams",          ISBN = "978-1-001-00005-5", PublicationDate = new DateTime(2019, 3,  22), Price = 20.00m, QuantityInStock = 25, AuthorId = 3,  ImageId = 5,  AdditionalDetails = "A gripping thriller where dreams blur the line between truth and deception." },
    new() { Title = "Mists of Algorab",        ISBN = "978-1-001-00006-6", PublicationDate = new DateTime(2023, 7,  14), Price = 18.00m, QuantityInStock = 55, AuthorId = 1,  ImageId = 6,  AdditionalDetails = "Literary fiction exploring the mysteries of an ancient land." },
    new() { Title = "Now You See Me",          ISBN = "978-1-001-00007-7", PublicationDate = new DateTime(2022, 11, 5),  Price = 16.00m, QuantityInStock = 30, AuthorId = 1,  ImageId = 7,  AdditionalDetails = "A suspenseful crime novel about illusion and identity." },
    new() { Title = "The Born of APLEX",       ISBN = "978-1-001-00008-8", PublicationDate = new DateTime(2021, 2,  18), Price = 20.00m, QuantityInStock = 45, AuthorId = 4,  ImageId = 8,  AdditionalDetails = "Science fiction at its finest — the birth of a new artificial species." },
    new() { Title = "Game Of Spades",          ISBN = "978-1-001-00009-9", PublicationDate = new DateTime(2023, 4,  30), Price = 18.50m, QuantityInStock = 20, AuthorId = 5,  ImageId = 9,  AdditionalDetails = "A high-stakes mystery thriller with unexpected twists." },
    new() { Title = "I'll Catch You",          ISBN = "978-1-001-00010-0", PublicationDate = new DateTime(2020, 6,  25), Price = 15.75m, QuantityInStock = 65, AuthorId = 6,  ImageId = 10, AdditionalDetails = "A relentless crime chase across three continents." },
    new() { Title = "Into The Wild",           ISBN = "978-1-001-00011-1", PublicationDate = new DateTime(2018, 9,  12), Price = 20.35m, QuantityInStock = 70, AuthorId = 7,  ImageId = 11, AdditionalDetails = "A true story of adventure, wilderness, and the human spirit." },
    new() { Title = "This Dark Road To Mercy", ISBN = "978-1-001-00012-2", PublicationDate = new DateTime(2017, 12, 3),  Price = 24.00m, QuantityInStock = 15, AuthorId = 8,  ImageId = 12, AdditionalDetails = "A Southern noir tale of family, crime, and redemption." },
    new() { Title = "Echoes of Eternity",      ISBN = "978-1-001-00013-3", PublicationDate = new DateTime(2023, 2,  8),  Price = 19.00m, QuantityInStock = 42, AuthorId = 9,  ImageId = 13, AdditionalDetails = "A sweeping romance spanning decades and continents." },
    new() { Title = "Shadow Protocol",         ISBN = "978-1-001-00014-4", PublicationDate = new DateTime(2022, 6,  17), Price = 21.50m, QuantityInStock = 38, AuthorId = 10, ImageId = 14, AdditionalDetails = "A detective thriller involving government conspiracies." },
    new() { Title = "The Last Horizon",        ISBN = "978-1-001-00015-5", PublicationDate = new DateTime(2021, 9,  3),  Price = 16.50m, QuantityInStock = 52, AuthorId = 12, ImageId = 15, AdditionalDetails = "Historical epic set during the fall of an ancient empire." },
    new() { Title = "Bloom & Ashes",           ISBN = "978-1-001-00016-6", PublicationDate = new DateTime(2020, 4,  22), Price = 13.99m, QuantityInStock = 44, AuthorId = 11, ImageId = 16, AdditionalDetails = "A literary tale of love, loss, and healing in rural England." },
    new() { Title = "Neon Prophecy",           ISBN = "978-1-001-00017-7", PublicationDate = new DateTime(2023, 10, 11), Price = 22.00m, QuantityInStock = 29, AuthorId = 4,  ImageId = 17, AdditionalDetails = "Dystopian sci-fi where technology controls prophecy." },
    new() { Title = "Whispers in the Fog",     ISBN = "978-1-001-00018-8", PublicationDate = new DateTime(2019, 7,  30), Price = 17.50m, QuantityInStock = 61, AuthorId = 6,  ImageId = 18, AdditionalDetails = "A chilling mystery set in a fog-covered Scottish village." },
    new() { Title = "The Pilgrim's Code",      ISBN = "978-1-001-00019-9", PublicationDate = new DateTime(2022, 3,  14), Price = 15.00m, QuantityInStock = 33, AuthorId = 2,  ImageId = 19, AdditionalDetails = "A spiritual adventure following an ancient pilgrimage route." },
    new() { Title = "Rebel Hearts",            ISBN = "978-1-001-00020-0", PublicationDate = new DateTime(2021, 12, 20), Price = 18.00m, QuantityInStock = 47, AuthorId = 5,  ImageId = 20, AdditionalDetails = "Teen fiction about rebellion, friendship, and first love." },
    new() { Title = "The Quantum Paradox",     ISBN = "978-1-001-00021-1", PublicationDate = new DateTime(2023, 5,  9),  Price = 23.00m, QuantityInStock = 36, AuthorId = 4,  ImageId = 21, AdditionalDetails = "Hard science fiction exploring time, space, and identity." },
    new() { Title = "Ashes to Empire",         ISBN = "978-1-001-00022-2", PublicationDate = new DateTime(2020, 1,  15), Price = 19.50m, QuantityInStock = 28, AuthorId = 12, ImageId = 22, AdditionalDetails = "The rise and fall of an empire told through three generations." },
    new() { Title = "Heart of the Tide",       ISBN = "978-1-001-00023-3", PublicationDate = new DateTime(2022, 8,  27), Price = 16.75m, QuantityInStock = 53, AuthorId = 9,  ImageId = 23, AdditionalDetails = "A coastal romance with secrets buried beneath the waves." },
    new() { Title = "Fractured Minds",         ISBN = "978-1-001-00024-4", PublicationDate = new DateTime(2021, 4,  5),  Price = 20.50m, QuantityInStock = 41, AuthorId = 3,  ImageId = 24, AdditionalDetails = "Psychological thriller about the fragile nature of sanity." },
    new() { Title = "The Forgotten Garden",    ISBN = "978-1-001-00025-5", PublicationDate = new DateTime(2019, 11, 18), Price = 14.50m, QuantityInStock = 67, AuthorId = 11, ImageId = 25, AdditionalDetails = "Literary fiction unraveling a family's hidden past." },
    new() { Title = "Midnight Protocol",       ISBN = "978-1-001-00026-6", PublicationDate = new DateTime(2023, 1,  22), Price = 21.00m, QuantityInStock = 24, AuthorId = 10, ImageId = 26, AdditionalDetails = "A crime thriller set in the underworld of a neon-lit city." },
    new() { Title = "Rise of the Ancients",    ISBN = "978-1-001-00027-7", PublicationDate = new DateTime(2022, 9,  13), Price = 17.25m, QuantityInStock = 58, AuthorId = 12, ImageId = 27, AdditionalDetails = "Historical adventure following an archaeologist into lost civilizations." },
    new() { Title = "Embers of Hope",          ISBN = "978-1-001-00028-8", PublicationDate = new DateTime(2020, 5,  7),  Price = 15.50m, QuantityInStock = 46, AuthorId = 2,  ImageId = 28, AdditionalDetails = "A self-help narrative about rebuilding life after loss." },
    new() { Title = "The Silver Thread",       ISBN = "978-1-001-00029-9", PublicationDate = new DateTime(2021, 7,  29), Price = 18.75m, QuantityInStock = 37, AuthorId = 9,  ImageId = 29, AdditionalDetails = "A timeless romance woven through generations of a family." },
    new() { Title = "Cold Equations",          ISBN = "978-1-001-00030-0", PublicationDate = new DateTime(2023, 3,  16), Price = 22.50m, QuantityInStock = 31, AuthorId = 4,  ImageId = 30, AdditionalDetails = "Sci-fi thriller where survival comes down to brutal mathematics." },
    new() { Title = "The Confessional",        ISBN = "978-1-001-00031-1", PublicationDate = new DateTime(2019, 6,  24), Price = 16.00m, QuantityInStock = 55, AuthorId = 8,  ImageId = 31, AdditionalDetails = "A spiritual drama exploring guilt, forgiveness, and redemption." },
    new() { Title = "Storm Chasers",           ISBN = "978-1-001-00032-2", PublicationDate = new DateTime(2022, 4,  3),  Price = 19.25m, QuantityInStock = 43, AuthorId = 5,  ImageId = 32, AdditionalDetails = "Young adult adventure about teens chasing storms and finding themselves." },
    new() { Title = "The Architect's Secret",  ISBN = "978-1-001-00033-3", PublicationDate = new DateTime(2021, 10, 11), Price = 20.75m, QuantityInStock = 26, AuthorId = 10, ImageId = 33, AdditionalDetails = "A mystery hidden within the blueprints of a century-old building." },
    new() { Title = "Beyond the Veil",         ISBN = "978-1-001-00034-4", PublicationDate = new DateTime(2020, 2,  28), Price = 17.00m, QuantityInStock = 62, AuthorId = 1,  ImageId = 34, AdditionalDetails = "Literary fiction examining life, death, and the world beyond." },
    new() { Title = "The Iron Compass",        ISBN = "978-1-001-00035-5", PublicationDate = new DateTime(2023, 6,  7),  Price = 21.75m, QuantityInStock = 34, AuthorId = 12, ImageId = 35, AdditionalDetails = "A naval historical adventure during the age of exploration." },
    new() { Title = "Parallel Lives",          ISBN = "978-1-001-00036-6", PublicationDate = new DateTime(2022, 12, 19), Price = 15.25m, QuantityInStock = 49, AuthorId = 11, ImageId = 36, AdditionalDetails = "Dual memoirs of two strangers whose lives intersect unexpectedly." },
    new() { Title = "Obsidian Sky",            ISBN = "978-1-001-00037-7", PublicationDate = new DateTime(2021, 3,  8),  Price = 23.50m, QuantityInStock = 22, AuthorId = 4,  ImageId = 37, AdditionalDetails = "Space opera with political intrigue and interstellar war." },
    new() { Title = "The Hollow Crown",        ISBN = "978-1-001-00038-8", PublicationDate = new DateTime(2019, 9,  16), Price = 18.25m, QuantityInStock = 57, AuthorId = 12, ImageId = 38, AdditionalDetails = "Historical drama about a king who loses everything to keep his kingdom." },
    new() { Title = "Love in the Time of Code",ISBN = "978-1-001-00039-9", PublicationDate = new DateTime(2023, 8,  25), Price = 16.50m, QuantityInStock = 39, AuthorId = 9,  ImageId = 39, AdditionalDetails = "A modern romance between two rival app developers." },
    new() { Title = "The Midnight Garden",     ISBN = "978-1-001-00040-0", PublicationDate = new DateTime(2020, 10, 4),  Price = 14.75m, QuantityInStock = 64, AuthorId = 3,  ImageId = 40, AdditionalDetails = "A psychological mystery set around a garden that only exists at night." },
    new() { Title = "Awakened Souls",          ISBN = "978-1-001-00041-1", PublicationDate = new DateTime(2022, 2,  12), Price = 19.75m, QuantityInStock = 32, AuthorId = 2,  ImageId = 41, AdditionalDetails = "A spiritual journey of self-discovery across sacred lands." },
    new() { Title = "Voltage",                 ISBN = "978-1-001-00042-2", PublicationDate = new DateTime(2021, 6,  21), Price = 17.75m, QuantityInStock = 48, AuthorId = 5,  ImageId = 42, AdditionalDetails = "A fast-paced teen thriller about hacking, power, and survival." },
    new() { Title = "The Glass House",         ISBN = "978-1-001-00043-3", PublicationDate = new DateTime(2023, 11, 30), Price = 20.25m, QuantityInStock = 27, AuthorId = 11, ImageId = 43, AdditionalDetails = "Literary fiction about transparency, secrets, and family bonds." },
    new() { Title = "Bloodline Protocol",      ISBN = "978-1-001-00044-4", PublicationDate = new DateTime(2020, 7,  9),  Price = 22.75m, QuantityInStock = 35, AuthorId = 10, ImageId = 44, AdditionalDetails = "A forensic crime thriller tracing a killer through DNA ancestry." },
    new() { Title = "Uncharted Waters",        ISBN = "978-1-001-00045-5", PublicationDate = new DateTime(2019, 4,  17), Price = 16.25m, QuantityInStock = 56, AuthorId = 7,  ImageId = 45, AdditionalDetails = "Memoir of a solo sailor's circumnavigation of the globe." },
    new() { Title = "Starfall",                ISBN = "978-1-001-00046-6", PublicationDate = new DateTime(2022, 7,  26), Price = 21.25m, QuantityInStock = 23, AuthorId = 4,  ImageId = 46, AdditionalDetails = "Sci-fi epic about the last survivors of a dying star system." },
    new() { Title = "The Ottoman Secret",      ISBN = "978-1-001-00047-7", PublicationDate = new DateTime(2021, 1,  14), Price = 18.00m, QuantityInStock = 45, AuthorId = 12, ImageId = 47, AdditionalDetails = "Historical thriller uncovering secrets of the Ottoman Empire." },
    new() { Title = "Mindful Mornings",        ISBN = "978-1-001-00048-8", PublicationDate = new DateTime(2023, 9,  3),  Price = 13.50m, QuantityInStock = 72, AuthorId = 2,  ImageId = 48, AdditionalDetails = "A practical guide to mindfulness and intentional living." },
    new() { Title = "The Promise of Rain",     ISBN = "978-1-001-00049-9", PublicationDate = new DateTime(2020, 3,  31), Price = 17.00m, QuantityInStock = 41, AuthorId = 9,  ImageId = 49, AdditionalDetails = "A rural romance about two farmers finding love in drought-stricken land." },
    new() { Title = "Dark Frequency",          ISBN = "978-1-001-00050-0", PublicationDate = new DateTime(2022, 10, 8),  Price = 20.00m, QuantityInStock = 30, AuthorId = 6,  ImageId = 50, AdditionalDetails = "A supernatural mystery involving radio signals from the dead." },
    new() { Title = "The Cartographer's Map",  ISBN = "978-1-001-00051-1", PublicationDate = new DateTime(2021, 8,  17), Price = 19.00m, QuantityInStock = 38, AuthorId = 12, ImageId = 51, AdditionalDetails = "Historical adventure following a map-maker into unknown territory." },
    new() { Title = "Reset",                   ISBN = "978-1-001-00052-2", PublicationDate = new DateTime(2023, 12, 14), Price = 15.75m, QuantityInStock = 54, AuthorId = 2,  ImageId = 52, AdditionalDetails = "A self-help guide to reinventing yourself at any age." },
    new() { Title = "Under the Tuscan Stars",  ISBN = "978-1-001-00053-3", PublicationDate = new DateTime(2019, 10, 22), Price = 18.50m, QuantityInStock = 47, AuthorId = 9,  ImageId = 53, AdditionalDetails = "A romantic escape set in the rolling hills of Tuscany." },
    new() { Title = "The Silent Witness",      ISBN = "978-1-001-00054-4", PublicationDate = new DateTime(2022, 5,  31), Price = 21.00m, QuantityInStock = 21, AuthorId = 10, ImageId = 54, AdditionalDetails = "A courtroom crime drama where the only witness cannot speak." },
    new() { Title = "Children of the Storm",   ISBN = "978-1-001-00055-5", PublicationDate = new DateTime(2020, 11, 10), Price = 16.75m, QuantityInStock = 59, AuthorId = 5,  ImageId = 55, AdditionalDetails = "Teen epic fantasy about siblings with elemental powers." },
    new() { Title = "The Philosopher's Garden",ISBN = "978-1-001-00056-6", PublicationDate = new DateTime(2023, 7,  19), Price = 14.25m, QuantityInStock = 66, AuthorId = 11, ImageId = 56, AdditionalDetails = "Literary fiction weaving philosophy through the lives of four friends." },
    new() { Title = "Orbit Zero",              ISBN = "978-1-001-00057-7", PublicationDate = new DateTime(2021, 11, 28), Price = 24.50m, QuantityInStock = 19, AuthorId = 4,  ImageId = 57, AdditionalDetails = "Sci-fi thriller about an abandoned space station with a dark secret." },
    new() { Title = "The Saint's Burden",      ISBN = "978-1-001-00058-8", PublicationDate = new DateTime(2019, 1,  7),  Price = 17.50m, QuantityInStock = 44, AuthorId = 8,  ImageId = 58, AdditionalDetails = "A religious historical novel following a tortured saint's journey." },
    new() { Title = "Burning Bridges",         ISBN = "978-1-001-00059-9", PublicationDate = new DateTime(2022, 3,  25), Price = 19.50m, QuantityInStock = 36, AuthorId = 3,  ImageId = 59, AdditionalDetails = "Psychological thriller about a woman who fakes her own death." },
    new() { Title = "The Memory Keeper",       ISBN = "978-1-001-00060-0", PublicationDate = new DateTime(2023, 10, 1),  Price = 22.00m, QuantityInStock = 28, AuthorId = 7,  ImageId = 60, AdditionalDetails = "Memoir of a journalist preserving the stories of war survivors." },
    ];
    }

    private IEnumerable<BookGenre> GetBookGenres()
    {
        // Genre IDs reference:
        // 1=Religion & Spirituality, 2=Teen & Young Adult, 3=Literature & Fiction
        // 4=Crime & Suspense,        5=Biographies & Memoirs, 6=Mystery & Thriller
        // 7=Science Fiction,         8=History,               9=Self Help, 10=Romance

        return
        [
        // 1 - Cyber Angel
        new() { BookId = 1,  GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 1,  GenreId = 3  }, // Literature & Fiction

    // 2 - Ark Forging
    new() { BookId = 2,  GenreId = 1  }, // Religion & Spirituality (primary)
    new() { BookId = 2,  GenreId = 8  }, // History
    new() { BookId = 2,  GenreId = 3  }, // Literature & Fiction

    // 3 - 2024 Sanctuary
    new() { BookId = 3,  GenreId = 2  }, // Teen & Young Adult (primary)
    new() { BookId = 3,  GenreId = 7  }, // Science Fiction

    // 4 - Feugiat Maecenas
    new() { BookId = 4,  GenreId = 5  }, // Biographies & Memoirs (primary)
    new() { BookId = 4,  GenreId = 3  }, // Literature & Fiction

    // 5 - Liar of Dreams
    new() { BookId = 5,  GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 5,  GenreId = 4  }, // Crime & Suspense

    // 6 - Mists of Algorab
    new() { BookId = 6,  GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 6,  GenreId = 8  }, // History

    // 7 - Now You See Me
    new() { BookId = 7,  GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 7,  GenreId = 6  }, // Mystery & Thriller

    // 8 - The Born of APLEX
    new() { BookId = 8,  GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 8,  GenreId = 3  }, // Literature & Fiction

    // 9 - Game Of Spades
    new() { BookId = 9,  GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 9,  GenreId = 4  }, // Crime & Suspense

    // 10 - I'll Catch You
    new() { BookId = 10, GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 10, GenreId = 6  }, // Mystery & Thriller

    // 11 - Into The Wild
    new() { BookId = 11, GenreId = 5  }, // Biographies & Memoirs (primary)
    new() { BookId = 11, GenreId = 8  }, // History

    // 12 - This Dark Road To Mercy
    new() { BookId = 12, GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 12, GenreId = 3  }, // Literature & Fiction

    // 13 - Echoes of Eternity
    new() { BookId = 13, GenreId = 10 }, // Romance (primary)
    new() { BookId = 13, GenreId = 3  }, // Literature & Fiction

    // 14 - Shadow Protocol
    new() { BookId = 14, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 14, GenreId = 4  }, // Crime & Suspense

    // 15 - The Last Horizon
    new() { BookId = 15, GenreId = 8  }, // History (primary)
    new() { BookId = 15, GenreId = 3  }, // Literature & Fiction

    // 16 - Bloom & Ashes
    new() { BookId = 16, GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 16, GenreId = 10 }, // Romance

    // 17 - Neon Prophecy
    new() { BookId = 17, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 17, GenreId = 6  }, // Mystery & Thriller

    // 18 - Whispers in the Fog
    new() { BookId = 18, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 18, GenreId = 4  }, // Crime & Suspense

    // 19 - The Pilgrim's Code
    new() { BookId = 19, GenreId = 1  }, // Religion & Spirituality (primary)
    new() { BookId = 19, GenreId = 8  }, // History

    // 20 - Rebel Hearts
    new() { BookId = 20, GenreId = 2  }, // Teen & Young Adult (primary)
    new() { BookId = 20, GenreId = 10 }, // Romance

    // 21 - The Quantum Paradox
    new() { BookId = 21, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 21, GenreId = 6  }, // Mystery & Thriller

    // 22 - Ashes to Empire
    new() { BookId = 22, GenreId = 8  }, // History (primary)
    new() { BookId = 22, GenreId = 3  }, // Literature & Fiction

    // 23 - Heart of the Tide
    new() { BookId = 23, GenreId = 10 }, // Romance (primary)
    new() { BookId = 23, GenreId = 6  }, // Mystery & Thriller

    // 24 - Fractured Minds
    new() { BookId = 24, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 24, GenreId = 4  }, // Crime & Suspense

    // 25 - The Forgotten Garden
    new() { BookId = 25, GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 25, GenreId = 6  }, // Mystery & Thriller

    // 26 - Midnight Protocol
    new() { BookId = 26, GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 26, GenreId = 7  }, // Science Fiction

    // 27 - Rise of the Ancients
    new() { BookId = 27, GenreId = 8  }, // History (primary)
    new() { BookId = 27, GenreId = 5  }, // Biographies & Memoirs

    // 28 - Embers of Hope
    new() { BookId = 28, GenreId = 9  }, // Self Help (primary)
    new() { BookId = 28, GenreId = 5  }, // Biographies & Memoirs

    // 29 - The Silver Thread
    new() { BookId = 29, GenreId = 10 }, // Romance (primary)
    new() { BookId = 29, GenreId = 3  }, // Literature & Fiction

    // 30 - Cold Equations
    new() { BookId = 30, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 30, GenreId = 6  }, // Mystery & Thriller

    // 31 - The Confessional
    new() { BookId = 31, GenreId = 1  }, // Religion & Spirituality (primary)
    new() { BookId = 31, GenreId = 3  }, // Literature & Fiction

    // 32 - Storm Chasers
    new() { BookId = 32, GenreId = 2  }, // Teen & Young Adult (primary)
    new() { BookId = 32, GenreId = 5  }, // Biographies & Memoirs

    // 33 - The Architect's Secret
    new() { BookId = 33, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 33, GenreId = 8  }, // History

    // 34 - Beyond the Veil
    new() { BookId = 34, GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 34, GenreId = 1  }, // Religion & Spirituality

    // 35 - The Iron Compass
    new() { BookId = 35, GenreId = 8  }, // History (primary)
    new() { BookId = 35, GenreId = 5  }, // Biographies & Memoirs

    // 36 - Parallel Lives
    new() { BookId = 36, GenreId = 5  }, // Biographies & Memoirs (primary)
    new() { BookId = 36, GenreId = 3  }, // Literature & Fiction

    // 37 - Obsidian Sky
    new() { BookId = 37, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 37, GenreId = 8  }, // History

    // 38 - The Hollow Crown
    new() { BookId = 38, GenreId = 8  }, // History (primary)
    new() { BookId = 38, GenreId = 3  }, // Literature & Fiction

    // 39 - Love in the Time of Code
    new() { BookId = 39, GenreId = 10 }, // Romance (primary)
    new() { BookId = 39, GenreId = 3  }, // Literature & Fiction

    // 40 - The Midnight Garden
    new() { BookId = 40, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 40, GenreId = 3  }, // Literature & Fiction

    // 41 - Awakened Souls
    new() { BookId = 41, GenreId = 1  }, // Religion & Spirituality (primary)
    new() { BookId = 41, GenreId = 9  }, // Self Help

    // 42 - Voltage
    new() { BookId = 42, GenreId = 2  }, // Teen & Young Adult (primary)
    new() { BookId = 42, GenreId = 7  }, // Science Fiction

    // 43 - The Glass House
    new() { BookId = 43, GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 43, GenreId = 6  }, // Mystery & Thriller

    // 44 - Bloodline Protocol
    new() { BookId = 44, GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 44, GenreId = 7  }, // Science Fiction

    // 45 - Uncharted Waters
    new() { BookId = 45, GenreId = 5  }, // Biographies & Memoirs (primary)
    new() { BookId = 45, GenreId = 8  }, // History

    // 46 - Starfall
    new() { BookId = 46, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 46, GenreId = 3  }, // Literature & Fiction

    // 47 - The Ottoman Secret
    new() { BookId = 47, GenreId = 8  }, // History (primary)
    new() { BookId = 47, GenreId = 6  }, // Mystery & Thriller

    // 48 - Mindful Mornings
    new() { BookId = 48, GenreId = 9  }, // Self Help (primary)
    new() { BookId = 48, GenreId = 1  }, // Religion & Spirituality

    // 49 - The Promise of Rain
    new() { BookId = 49, GenreId = 10 }, // Romance (primary)
    new() { BookId = 49, GenreId = 3  }, // Literature & Fiction

    // 50 - Dark Frequency
    new() { BookId = 50, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 50, GenreId = 7  }, // Science Fiction

    // 51 - The Cartographer's Map
    new() { BookId = 51, GenreId = 8  }, // History (primary)
    new() { BookId = 51, GenreId = 5  }, // Biographies & Memoirs

    // 52 - Reset
    new() { BookId = 52, GenreId = 9  }, // Self Help (primary)
    new() { BookId = 52, GenreId = 3  }, // Literature & Fiction

    // 53 - Under the Tuscan Stars
    new() { BookId = 53, GenreId = 10 }, // Romance (primary)
    new() { BookId = 53, GenreId = 3  }, // Literature & Fiction

    // 54 - The Silent Witness
    new() { BookId = 54, GenreId = 4  }, // Crime & Suspense (primary)
    new() { BookId = 54, GenreId = 6  }, // Mystery & Thriller

    // 55 - Children of the Storm
    new() { BookId = 55, GenreId = 2  }, // Teen & Young Adult (primary)
    new() { BookId = 55, GenreId = 7  }, // Science Fiction

    // 56 - The Philosopher's Garden
    new() { BookId = 56, GenreId = 3  }, // Literature & Fiction (primary)
    new() { BookId = 56, GenreId = 1  }, // Religion & Spirituality

    // 57 - Orbit Zero
    new() { BookId = 57, GenreId = 7  }, // Science Fiction (primary)
    new() { BookId = 57, GenreId = 6  }, // Mystery & Thriller

    // 58 - The Saint's Burden
    new() { BookId = 58, GenreId = 1  }, // Religion & Spirituality (primary)
    new() { BookId = 58, GenreId = 8  }, // History

    // 59 - Burning Bridges
    new() { BookId = 59, GenreId = 6  }, // Mystery & Thriller (primary)
    new() { BookId = 59, GenreId = 4  }, // Crime & Suspense

    // 60 - The Memory Keeper
    new() { BookId = 60, GenreId = 5  }, // Biographies & Memoirs (primary)
    new() { BookId = 60, GenreId = 3  }, // Literature & Fiction
    ];
    }
}
