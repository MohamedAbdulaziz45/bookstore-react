using System;

namespace BookStore.Domain.Entities;

public class Person
{
    public int PersonId { get; set; }

    public string NationalNo { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string SecondName { get; set; } = default!;
    public string? ThirdName { get; set; }
    public string LastName { get; set; } = default!;
    public DateTime DateOfBirth { get; set; }
    public byte Gender { get; set; }
    public string Address { get; set; } = default!;
    public string? ImagePath { get; set; }


}
