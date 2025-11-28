using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using OnlineStore.Domain.Enums;
using System.Security.Claims;

namespace OnlineStore.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("infome")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userId, out Guid UserId))
            {
                _logger.LogInformation($"Получение информации о текущем пользователе с идентификатором {UserId}");
                var user = await _userService.GetByIdAsync(UserId);
                if (user == null)
                {
                    _logger.LogWarning($"Пользователь с Id {UserId} не найден");
                    return NotFound();
                }
                return Ok(user);
            }
            _logger.LogWarning("Попытка несанкционированного доступа при обновлении профиля");
            return Unauthorized();
        }

        [Authorize(Policy = "SuperAdminPolicy")]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetAll()
        {
            _logger.LogInformation("Администратор запрашивает список всех пользователей");
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPut("infome/name")]
        public async Task<IActionResult> Update([FromBody] UpdateUserDto dto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userId, out Guid UserId))
            { 
                _logger.LogWarning("Попытка несанкционированного доступа при обновлении профиля");
                return Unauthorized();
            }
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Ошибка валидации данных при обновлении профиля");
                return BadRequest(ModelState);
            }
            try
            {
                var success = await _userService.UpdateAsync(UserId, dto);
                _logger.LogInformation($"Пользователь с Id {UserId} обновляет свои данные (Email/Username)");
                if (!success)
                {
                    _logger.LogWarning($"Пользователь с Id {UserId} не найден при обновлении профиля");
                    return NotFound();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Пользователь с Id {UserId} не смог обновить свои данные (Email/Username): {ex.Message}");
                return Conflict(ex.Message);
            }
        }

        [HttpPatch("infome/password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userId, out Guid UserId))
            {
                _logger.LogInformation($"Пользователь с Id {UserId} обновляет свой пароль");
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Ошибка валидации данных при смене пароля");
                    return BadRequest(ModelState);
                }
                try
                {
                    await _userService.UpdatePasswordAsync(UserId, updatePasswordDto);
                    if (Request.Cookies.ContainsKey("AppCookie"))
                    {
                        var cookieOptions = new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.None
                        };
                        Response.Cookies.Delete("AppCookie", cookieOptions);
                        _logger.LogInformation($"Пользователь с Id {UserId} вышел из аккаунта, т.к. был изменен им пароль.");
                    }
                    return Ok();
                }
                catch (KeyNotFoundException ex)
                {
                    _logger.LogWarning($"Неудачная попытка смены пароля для пользователя {UserId}: {ex.Message}");
                    return NotFound(); 
                }
                catch (InvalidOperationException ex)
                {
                    _logger.LogWarning($"Неверный старый пароль для пользователя {UserId}: {ex.Message}");
                    return BadRequest(); 
                }
            }
            _logger.LogWarning("Попытка несанкционированного доступа для обновления пароля");
            return Unauthorized();
        }

        [Authorize(Policy = "SuperAdminPolicy")]
        [HttpPatch("{id}/role")]
        public async Task<IActionResult> ChangeRole(Guid id, [FromBody] UpdateUserRoleDto dto)
        {
            _logger.LogInformation($"Главный администратор изменяет роль пользователя с Id {id} на {dto.Role}");
            var success = await _userService.ChangeUserRoleAsync(id, dto.Role);
            if (!success)
            {
                _logger.LogWarning($"Не удалось изменить роль — пользователь с Id {id} не найден");
                return NotFound();
            }
            _logger.LogInformation($"Роль пользователя с Id {id} успешно изменена на {dto.Role}");
            return Ok();
        }

        [Authorize(Policy = "SuperAdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            _logger.LogInformation($"Главный администратор удаляет пользователя с Id {id}");
            var success = await _userService.DeleteAsync(id);
            if (!success)
            {
                _logger.LogWarning($"Удаление не удалось — пользователь с Id {id} не найден");
                return NotFound();
            }
            _logger.LogInformation($"Пользователь с Id {id} успешно удален");
            return NoContent();
        }
    }
}
