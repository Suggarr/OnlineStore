using Microsoft.EntityFrameworkCore;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Data;

namespace OnlineStore.Infrastructure.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetAllForUserAsync(Guid userId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        public async Task<CartItem?> GetByIdAsync(Guid id, Guid userId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        }

        public async Task<CartItem?> GetByProductIdAsync(Guid productId, Guid userId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
        }

        public async Task AddAsync(CartItem item)
        {
            await _context.CartItems.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuantityAsync(Guid id, int quantity, Guid userId)
        {
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (item != null)
            {
                item.Quantity = quantity;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Guid id, Guid userId)
        {
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearAsync(Guid userId)
        {
            var items = _context.CartItems.Where(c => c.UserId == userId);
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByUserAndProductAsync(Guid productId, Guid userId)
        {
            return await _context.CartItems.AnyAsync(c => c.ProductId == productId && c.UserId == userId);
        }
    }
}
