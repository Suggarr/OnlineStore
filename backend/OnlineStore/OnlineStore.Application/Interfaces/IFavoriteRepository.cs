using OnlineStore.Domain.Entities;

namespace OnlineStore.Infrastructure.Repositories
{
    public interface IFavoriteRepository
    {
        Task AddAsync(Favorite favorite);
        Task DeleteAsync(Guid id, Guid userId);
        Task<Favorite?> GetByUserAndProductAsync(Guid id, Guid userId);
        Task<IEnumerable<Favorite>> GetFavoritesForUserAsync(Guid userId);
    }
}