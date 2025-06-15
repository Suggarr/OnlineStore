using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces;

public interface ICartRepository
{
    Task<IEnumerable<CartItem>> GetAllAsync();
    Task<CartItem?> GetByIdAsync(Guid id);
    Task AddAsync(CartItem item);
    Task UpdateQuantityAsync(Guid id, int quantity);
    Task DeleteAsync(Guid id);
    Task ClearAsync(); // Очистка всей корзины (если будет нужно)
}
