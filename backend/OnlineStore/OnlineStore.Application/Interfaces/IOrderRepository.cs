using OnlineStore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllForUserAsync(Guid userId);
        Task<Order?> GetByIdAsync(Guid id, Guid userId);
        Task AddAsync(Order order);
    }
}