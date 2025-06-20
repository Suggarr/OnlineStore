using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces
{

    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetAllForUserAsync(Guid userId);
        Task<CartItem?> GetByIdAsync(Guid id, Guid userId);
        Task<CartItem?> GetByProductIdAsync(Guid productId, Guid userId);
        Task AddAsync(CartItem item);
        Task UpdateQuantityAsync(Guid id, int quantity, Guid userId);
        Task DeleteAsync(Guid id, Guid userId);
        Task ClearAsync(Guid userId);
    }
}
