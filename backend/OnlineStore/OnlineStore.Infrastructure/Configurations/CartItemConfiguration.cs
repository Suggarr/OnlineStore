using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Infrastructure.Configurations
{
    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(ci => ci.Id);

            builder
                .Property(ci => ci.Quantity)
                .IsRequired();

            builder.Property(ci => ci.Price)
                .HasPrecision(18, 2);

            builder
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
