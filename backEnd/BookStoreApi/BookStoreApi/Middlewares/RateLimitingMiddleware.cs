using BookStore.Application.Users;

using System.Collections.Concurrent;

namespace BookStoreApi.Middlewares;

public class RateLimitingMiddleware(
ILogger<RateLimitingMiddleware> logger,
   IUserContext userContext) : IMiddleware
{
    private static readonly ConcurrentDictionary<string, ClientRequestInfo> _clients = new();
    private const int _limit = 50;
    private static readonly TimeSpan _window = TimeSpan.FromMinutes(1);
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var currentUser = userContext.GetCurrentUser();

        var (clientKey, clientType) = currentUser is not null
            ? (currentUser.Id, "User")
            : (context.Connection.RemoteIpAddress?.ToString() ?? "unknown", "IP");
        var now = DateTime.UtcNow;

        var info = _clients.AddOrUpdate(
        clientKey,
        _ => new ClientRequestInfo { WindowStart = now, Count = 1 },
        (_, existing) =>
        {
            if (now - existing.WindowStart >= _window)
            {
                existing.WindowStart = now;
                existing.Count = 1;
            }
            else
            {
                existing.Count++;
            }
            return existing;
        }
        );

        var remaining = _limit - info.Count;
        var resetTime = info.WindowStart.Add(_window);

        context.Response.Headers["X-RateLimit-Limit"] = _limit.ToString();
        context.Response.Headers["X-RateLimit-Remaining"] = Math.Max(0,remaining).ToString();
        context.Response.Headers["X-RateLimit-Reset"] = new DateTimeOffset(resetTime).ToUnixTimeSeconds().ToString();
      
        if(info.Count> _limit)
        {
          var retryAfter = (int)(resetTime - now).TotalSeconds;
          logger.LogWarning(
          "Rate limit exceeded for {ClientType}: {ClientKey}",
          clientType, clientKey
          );

            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers["Retry-After"] = retryAfter.ToString();
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Too many requests. Please try again later.",
                retryAfterSeconds = retryAfter
            });
            return;

        }

        await next(context);
    }
    private class ClientRequestInfo
    {
        public DateTime WindowStart { get; set; }
        public int Count { get; set; }
    }
}
