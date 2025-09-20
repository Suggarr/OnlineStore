using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Interfaces
{
    public interface IProductRepository
    {
        Task AddAsync(Product product);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId);
        Task<Product?> GetByIdAsync(Guid id);
        Task UpdateAsync(Product product);
    }
}