using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces
{
    public interface ICategoryRepository
    {
        Task AddAsync(Category category);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(Guid id);
        Task UpdateAsync(Category category);
    }
}