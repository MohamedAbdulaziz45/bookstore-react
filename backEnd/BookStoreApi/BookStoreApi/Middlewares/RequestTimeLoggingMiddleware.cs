using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace BookStoreApi.Middlewares;

public class RequestTimeLoggingMiddleware(ILogger<RequestTimeLoggingMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {

        var stopwatch = Stopwatch.StartNew();

        await next.Invoke(context);

        stopwatch.Stop();
        var elapsedMs = stopwatch.Elapsed.TotalMilliseconds;

        if (elapsedMs / 1000 > 4)
        {

            logger.LogInformation(
            "Request [{verb}] at {Path} took {Time} ms",
            context.Request.Method,
            context.Request.Path,
            stopwatch.Elapsed.TotalMilliseconds);
        }
    }
}
