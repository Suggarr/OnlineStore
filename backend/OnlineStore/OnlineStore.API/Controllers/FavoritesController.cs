using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using System.Security.Claims;

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

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                _logger.LogWarning("Идентификатор пользователя не найден в токене.");
                throw new UnauthorizedAccessException("Идентификатор пользователя не найден в токене.");
            }

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning($"Некорректный формат идентификатора пользователя в токене: {userIdClaim}");
                throw new UnauthorizedAccessException("Некорректный формат идентификатора пользователя в токене.");
            }
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<FavoriteDto>> GetUserFavorites()
        {
            var userId = GetUserId();
            _logger.LogInformation($"Пользователь {userId} запрашивает информацию об избранных товарах");

            var favorites = await _favoriteService.GetFavoritesForUserAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("{productId:guid}/toggle")]
        public async Task<IActionResult> ToggleFavorite(Guid productId)
        {
            try
            {
                var userId = GetUserId();
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
