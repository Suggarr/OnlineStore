using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;

namespace OnlineStore.Application.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<CartItemDto>> GetAllAsync(Guid userId)
        {
            var items = await _cartRepository.GetAllForUserAsync(userId);

            return items.Select(item => new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Price = item.Product.Price,
                ImageUrl = item.Product.ImageUrl,
                Quantity = item.Quantity
            });
        }

        public async Task<CartItemDto?> GetByIdAsync(Guid id, Guid userId)
        {
            var item = await _cartRepository.GetByIdAsync(id, userId);
            if (item == null)
                return null;

            return new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Price = item.Product.Price,
                ImageUrl = item.Product.ImageUrl,
                Quantity = item.Quantity
            };
        }

        public async Task<bool> AddToCartAsync(Guid userId, CreateCartItemDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product is null)
                return false;

            // Проверяем, есть ли уже такой товар в корзине пользователя
            var existingItem = await _cartRepository.GetByProductIdAsync(dto.ProductId, userId);
            if (existingItem != null)
            {
                // Если есть, просто увеличиваем количество
                existingItem.Quantity += dto.Quantity;
                await _cartRepository.UpdateQuantityAsync(existingItem.Id, existingItem.Quantity, userId);
            }
            else
            {
                // Если нет — создаем новый
                var cartItem = new CartItem
                {
                    ProductId = product.Id,
                    Quantity = dto.Quantity,
                    UserId = userId
                };

                await _cartRepository.AddAsync(cartItem);
            }
            return true;
        }

        public async Task<bool> UpdateQuantityAsync(Guid id, int quantity, Guid userId)
        {
            var item = await _cartRepository.GetByIdAsync(id, userId);
            if (item == null)
                return false;

            await _cartRepository.UpdateQuantityAsync(id, quantity, userId);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var item = await _cartRepository.GetByIdAsync(id, userId);
            if (item == null)
                return false;

            await _cartRepository.DeleteAsync(id, userId);
            return true;
        }

        public async Task ClearAsync(Guid userId)
        {
            await _cartRepository.ClearAsync(userId);
        }
    }
}
