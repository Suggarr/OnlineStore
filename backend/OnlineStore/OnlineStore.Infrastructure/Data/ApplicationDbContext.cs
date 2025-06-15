using Microsoft.EntityFrameworkCore;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Configurations;

namespace OnlineStore.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProductConfiguration());
            modelBuilder.ApplyConfiguration(new CartItemConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }

}
