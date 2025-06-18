using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetAllAsync(Guid userId);
        Task<CartItemDto?> GetByIdAsync(Guid id, Guid userId);
        Task<bool> AddToCartAsync(Guid userId, CreateCartItemDto dto);
        Task<bool> UpdateQuantityAsync(Guid id, int quantity, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
        Task ClearAsync(Guid userId);
    }
}
