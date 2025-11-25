using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Infrastructure.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(p => p.Description)
                   .IsRequired()
                   .HasMaxLength(300);

            builder.Property(p => p.Price)
                   .IsRequired()
                   .HasPrecision(18, 2); 

            builder.Property(p => p.ImageUrl)
                   .IsRequired()
                   .HasMaxLength(300);

            builder.HasOne(p => p.Category)
                   .WithMany(c => c.Products)
                   .HasForeignKey(p => p.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
