using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces
{
    public interface IFavoriteRepository
    {
        Task AddAsync(Favorite favorite);
        Task DeleteAsync(Guid favoriteId, Guid userId);
        Task<bool> ExistsByUserAndProductAsync(Guid userId, Guid productId);
        Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId);
        Task<IEnumerable<Favorite>> GetFavoritesForUserAsync(Guid userId);
    }
}