
namespace BookStore.Domain.Constants;

public enum CheckoutIntentStatus
{
    Created = 0,
    SessionCreated = 1,
    Fulfilled = 2,
    Failed = 3,
    Expired = 4
}
