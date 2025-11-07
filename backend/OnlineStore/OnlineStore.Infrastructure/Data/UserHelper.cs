using Microsoft.Extensions.Logging;
using OnlineStore.Domain.Entities;
using System.Security.Claims;

namespace OnlineStore.Application.Services
{
    public static class UserHelper
    {
        public static Guid GetUserId(ClaimsPrincipal User, ILogger logger)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                logger.LogWarning("Идентификатор пользователя не найден в токене.");
                throw new UnauthorizedAccessException("Идентификатор пользователя не найден в токене.");
            }

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                logger.LogWarning($"Некорректный формат идентификатора пользователя в токене: {userIdClaim}");
                throw new UnauthorizedAccessException("Некорректный формат идентификатора пользователя в токене.");
            }
            return userId;
        }
    }
}
