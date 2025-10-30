using Microsoft.EntityFrameworkCore;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Data;

namespace OnlineStore.Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Favorite>> GetFavoritesForUserAsync(Guid userId)
        {
            return await _context.Favorites
                .Include(f => f.Product)
                    .ThenInclude(p => p.Category)
                .Where(f => f.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId)
        {
            return await _context.Favorites
                .Include(f => f.Product)
                .FirstOrDefaultAsync(f => f.ProductId == productId && f.UserId == userId);
        }

        public async Task AddAsync(Favorite favorite)
        {
            await _context.Favorites.AddAsync(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByUserAndProductAsync(Guid userId, Guid productId)
        {
            return await _context.Favorites.AnyAsync(f => f.UserId == userId && f.ProductId == productId);
        }

        public async Task DeleteAsync(Guid favoriteId, Guid userId)
        {
            var favorite = await _context.Favorites.FirstOrDefaultAsync(c => c.Id == favoriteId && c.UserId == userId);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }
    }
}
