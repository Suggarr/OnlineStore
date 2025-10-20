using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDto> AddAsync(CreateCategoryDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<CategoryDto?> GetById(Guid Id);
        Task<bool> UpdatedAsync(Guid id, UpdateCategoryDto dto);
    }
}