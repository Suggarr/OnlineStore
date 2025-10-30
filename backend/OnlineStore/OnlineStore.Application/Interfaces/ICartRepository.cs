using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces
{
    public interface ICartRepository
    {
        Task AddAsync(CartItem item);
        Task ClearAsync(Guid userId);
        Task DeleteAsync(Guid id, Guid userId);
        Task<bool> ExistsByUserAndProductAsync(Guid productId, Guid userId);
        Task<IEnumerable<CartItem>> GetAllForUserAsync(Guid userId);
        Task<CartItem?> GetByIdAsync(Guid id, Guid userId);
        Task<CartItem?> GetByProductIdAsync(Guid productId, Guid userId);
        Task UpdateQuantityAsync(Guid id, int quantity, Guid userId);
    }
}