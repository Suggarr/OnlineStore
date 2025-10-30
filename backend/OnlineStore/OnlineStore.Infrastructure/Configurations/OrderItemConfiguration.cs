using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Infrastructure.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.HasKey(oi => oi.Id);

            builder.HasOne(oi => oi.Order)
                   .WithMany(o => o.Items)
                   .HasForeignKey(oi => oi.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Property(oi => oi.ProductId)
                   .IsRequired();

            builder.Property(oi => oi.ProductName)
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(oi => oi.Price)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(oi => oi.Quantity)
                   .IsRequired();
        }
    }
}