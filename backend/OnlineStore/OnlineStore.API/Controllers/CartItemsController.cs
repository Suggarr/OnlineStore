using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Application.Services;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetAll()
        {
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Получение всех товаров в корзине для пользователя с Id {userId}");

            var items = await _cartService.GetAllAsync(userId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CreateCartItemDto dto)
        {
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Добавление товара с ProductId {dto.ProductId} в корзину пользователя {userId}");

            var added = await _cartService.AddToCartAsync(userId, dto);
            if (!added)
            {
                _logger.LogWarning($"Не удалось добавить товар с ProductId {dto.ProductId} в корзину — товар не найден");
                return NotFound($"Товар с ProductId {dto.ProductId} не найден");
            }
            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CartItemDto>> GetById(Guid id)
        {
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Получение товара из корзины с Id {id} для пользователя {userId}");

            var item = await _cartService.GetByIdAsync(id, userId);
            if (item is null)
            {
                _logger.LogWarning($"Товар с Id {id} не найден в корзине пользователя {userId}");
                return NotFound();
            }
            return Ok(item);
        }

        [HttpGet("contains/{productId:guid}")]
        public async Task<ActionResult<bool>> IsInCart(Guid productId)
        {
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Проверка наличия товара с ProductId {productId} в корзине пользователя {userId}");
            var isInCart = await _cartService.IsProductInCartAsync(userId, productId);
            return Ok(isInCart);
        }

        [HttpPatch("{id:guid}/quantity")]
        public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemQuantityDto dto)
        {
            var userId = UserHelper.GetUserId(User, _logger);

            _logger.LogInformation($"Пользователь {userId} пытается изменить количество позиции корзины {id} на {dto.Quantity}.");

            try
            {
                var updated = await _cartService.UpdateQuantityAsync(id, dto.Quantity, userId);

                if (!updated)
                {
                    _logger.LogWarning($"Не удалось обновить количество — пользователь {userId} попытался изменить количество несуществующей позиции корзины {id}.");
                    return NotFound("Товар не найден в корзине.");
                }

                if (dto.Quantity <= 0)
                {
                    _logger.LogInformation($"Пользователь {userId} удалил товар из корзины (позиция {id}), так как указал количество 0 или меньше.");
                }
                else
                {
                    _logger.LogInformation($"Пользователь {userId} успешно обновил количество товара в корзине (позиция {id}) до {dto.Quantity}.");
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Пользователь {userId} указал некорректное количество {dto.Quantity} для позиции корзины {id}: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,$"Произошла непредвиденная ошибка при обновлении количества позиции корзины {id} пользователем {userId}.");
                return StatusCode(500, "Произошла ошибка при обновлении количества.");
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = UserHelper.GetUserId(User, _logger);
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
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Очистка корзины пользователя с Id {userId}");

            await _cartService.ClearAsync(userId);
            return NoContent();
        }
    }
}
