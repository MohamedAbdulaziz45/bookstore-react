using System;
using System.Collections.Generic;

namespace BookStore.Domain.Entities;

public class Customer
{
    public int CustomerId { get; set; }
    public string? StripeCustomerId { get; set; }
    public DateTime MemeberSince { get; set; }
    public bool IsDeleted { get; set; }

    public string UserId { get; set; } = default!;
    public User? User { get; set; }
    public Cart? Cart { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<NewsletterSubscription> NewsletterSubscriptions { get; set; } = new List<NewsletterSubscription>();

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<CheckoutIntent> CheckoutIntents { get; set; } = new List<CheckoutIntent>();

}
