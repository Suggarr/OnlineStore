using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<IEnumerable<ProductDto>> GetByCategoryIdAsync(Guid categoryId);
        Task<ProductDto?> GetByIdAsync(Guid id);
        Task<bool> UpdateAsync(Guid id, UpdateProductDto dto);
    }
}