using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> ToggleFavoriteAsync(Guid userId, Guid productId);
        Task<IEnumerable<FavoriteDto>> GetFavoritesForUserAsync(Guid userId);
    }
}