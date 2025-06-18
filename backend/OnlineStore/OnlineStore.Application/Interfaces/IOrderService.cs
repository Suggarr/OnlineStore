using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using OnlineStore.Application.DTO;

namespace OnlineStore.Application.Interfaces
{
    public interface IOrderService
    {
        Task CreateOrderAsync(Guid userId);
        Task<IEnumerable<OrderDto>> GetOrdersAsync(Guid userId);
        Task<OrderDto?> GetOrderByIdAsync(Guid id, Guid userId);
    }
}
