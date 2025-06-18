using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderService(ICartRepository cartRepository, IOrderRepository orderRepository)
        {
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
        }

        public async Task CreateOrderAsync(Guid userId)
        {
            var cartItems = await _cartRepository.GetAllForUserAsync(userId);
            if (!cartItems.Any())
                throw new InvalidOperationException("Cart is empty");

            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Items = cartItems.Select(ci => new OrderItem
                {
                    ProductName = ci.Product.Name,
                    Price = ci.Product.Price,
                    Quantity = ci.Quantity,
                    ImageUrl = ci.Product.ImageUrl
                }).ToList()
            };

            await _orderRepository.AddAsync(order);
            await _cartRepository.ClearAsync(userId);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersAsync(Guid userId)
        {
            var orders = await _orderRepository.GetAllForUserAsync(userId);
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    ImageUrl = i.ImageUrl
                }).ToList()
            });
        }

        public async Task<OrderDto?> GetOrderByIdAsync(Guid id, Guid userId)
        {
            var order = await _orderRepository.GetByIdAsync(id, userId);
            if (order == null)
                return null;

            return new OrderDto
            {
                Id = order.Id,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    ImageUrl = i.ImageUrl
                }).ToList()
            };
        }
    }
}
