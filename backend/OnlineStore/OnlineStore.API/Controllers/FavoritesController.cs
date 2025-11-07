using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Application.Services;

namespace OnlineStore.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        private readonly ILogger<FavoritesController> _logger;
        public FavoritesController(IFavoriteService favoriteService, ILogger<FavoritesController> logger)
        {
            _favoriteService = favoriteService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<FavoriteDto>> GetUserFavorites()
        {
            var userId = UserHelper.GetUserId(User, _logger);
            _logger.LogInformation($"Пользователь {userId} запрашивает список избранных товаров");

            var favorites = await _favoriteService.GetFavoritesForUserAsync(userId);
            return Ok(favorites);
        }

        [HttpGet("contains/{productId:guid}")]
        public async Task<IActionResult> IsFavoriteProduct(Guid productId)
        {
            var userId = UserHelper.GetUserId(User, _logger);
            var favorite = await _favoriteService.IsFavoriteAsync(userId, productId);
            _logger.LogInformation($"Пользователь {userId} проверяет, находится ли товар {productId} в избранных"); ;
            return Ok(favorite);
        }

        [HttpPost("{productId:guid}/toggle")]
        public async Task<IActionResult> ToggleFavorite(Guid productId)
        {
            try
            {
                var userId = UserHelper.GetUserId(User, _logger);
                var added = await _favoriteService.ToggleFavoriteAsync(userId, productId);
                _logger.LogInformation($"Пользователь {userId} {(added ? $"добавил товар {productId} в избранное" : $"удалил товар {productId} из избранных")}");
                return Ok(added);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                return NotFound();
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                return StatusCode(500, "Произошла ошибка при обработке запроса.");
            }
        }
    }
}
