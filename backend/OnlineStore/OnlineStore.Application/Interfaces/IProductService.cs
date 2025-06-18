using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(Guid id);
        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateProductDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
