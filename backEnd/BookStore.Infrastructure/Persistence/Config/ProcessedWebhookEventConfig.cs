using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class ProcessedWebhookEventConfig : IEntityTypeConfiguration<ProcessedWebhookEvent>
{
    public void Configure(EntityTypeBuilder<ProcessedWebhookEvent> builder)
    {
        builder.HasKey(e => e.EventId);
        builder.Property(e => e.EventId).IsRequired().HasMaxLength(255);
        builder.Property(e => e.EventType).IsRequired().HasMaxLength(100);
    }
}