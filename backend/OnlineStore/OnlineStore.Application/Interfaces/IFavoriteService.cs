using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<FavoriteDto>> GetFavoritesForUserAsync(Guid userId);
        Task<bool> IsFavoriteAsync(Guid userId, Guid productId);
        Task<bool> ToggleFavoriteAsync(Guid userId, Guid productId);
    }
}