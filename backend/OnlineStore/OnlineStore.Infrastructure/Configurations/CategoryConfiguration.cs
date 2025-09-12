using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Infrastructure.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(c => c.Description)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(c => c.Image)
                   .IsRequired()
                   .HasMaxLength(300);

            builder.Property(c => c.CreatedAt)
                   .IsRequired();

            builder.Property(c => c.UpdatedAt)
                   .IsRequired();
        }
    }
}
