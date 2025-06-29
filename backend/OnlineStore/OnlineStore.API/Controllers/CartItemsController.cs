using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using System.Security.Claims;

namespace OnlineStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartItemsController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly ILogger<CartItemsController> _logger;

        public CartItemsController(ICartService cartService, ILogger<CartItemsController> logger)
        {
            _cartService = cartService;
            _logger = logger;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                _logger.LogWarning("Id пользователя не найден в токене");
                throw new UnauthorizedAccessException("User ID claim not found");
            }
            return Guid.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetAll()
        {
            var userId = GetUserId();
            _logger.LogInformation($"Получение всех товаров в корзине для пользователя с Id {userId}");

            var items = await _cartService.GetAllAsync(userId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(CreateCartItemDto dto)
        {
            var userId = GetUserId();
            _logger.LogInformation($"Добавление товара с ProductId {dto.ProductId} в корзину пользователя {userId}");

            var added = await _cartService.AddToCartAsync(userId, dto);
            if (!added)
            {
                _logger.LogWarning($"Не удалось добавить товар с ProductId {dto.ProductId} в корзину — товар не найден");
                return NotFound("Product not found");
            }
            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CartItemDto>> GetById(Guid id)
        {
            var userId = GetUserId();
            _logger.LogInformation($"Получение товара из корзины с Id {id} для пользователя {userId}");

            var item = await _cartService.GetByIdAsync(id, userId);
            if (item is null)
            {
                _logger.LogWarning($"Товар с Id {id} не найден в корзине пользователя {userId}");
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPatch("{id:guid}/quantity")]
        public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemQuantityDto dto)
        {
            var userId = GetUserId();
            _logger.LogInformation($"Обновление количества товара с Id {id} до {dto.Quantity} для пользователя {userId}");
            var updated = await _cartService.UpdateQuantityAsync(id, dto.Quantity, userId);
            if (!updated)
            {
                _logger.LogWarning($"Не удалось обновить количество — товар с Id {id} не найден в корзине пользователя {userId}");
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            _logger.LogInformation($"Удаление товара с Id {id} из корзины пользователя {userId}");

            var deleted = await _cartService.DeleteAsync(id, userId);
            if (!deleted)
            {
                _logger.LogWarning($"Не удалось удалить — товар с Id {id} не найден в корзине пользователя {userId}");
                return NotFound();
            }
            return NoContent();//Изменю потом NoContent() на Ok(),чтобы вернуть хотя что-то
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();
            _logger.LogInformation($"Очистка корзины пользователя с Id {userId}");

            await _cartService.ClearAsync(userId);
            return NoContent();
        }
    }
}
