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

            builder.Property(ci => ci.ProductName)
                .IsRequired()
                .HasMaxLength(200); // например, ограничим длину имени

            builder.Property(ci => ci.Price)
                .HasPrecision(18, 2);

            builder.Property(ci => ci.ImageUrl)
                .HasMaxLength(500);

            builder.Property(ci => ci.Quantity)
                .IsRequired();

            // Явная связь с Product
            builder.HasOne(ci => ci.Product)
                .WithMany() // если в Product нет обратной коллекции CartItems
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Явная связь с User
            builder.HasOne(ci => ci.User)
                .WithMany(u => u.CartItems)  // <-- вот здесь указать навигационное свойство
                .HasForeignKey(ci => ci.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
