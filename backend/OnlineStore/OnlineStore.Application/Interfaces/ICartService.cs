using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface ICartService
    {
        Task<bool> AddToCartAsync(Guid userId, CreateCartItemDto dto);
        Task ClearAsync(Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
        Task<IEnumerable<CartItemDto>> GetAllAsync(Guid userId);
        Task<CartItemDto?> GetByIdAsync(Guid id, Guid userId);
        Task<bool> IsProductInCartAsync(Guid userId, Guid productId);
        Task<bool> UpdateQuantityAsync(Guid id, int quantity, Guid userId);
    }
}