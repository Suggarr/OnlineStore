using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using OnlineStore.Domain.Enums;
using System.Security.Claims;

namespace OnlineStore.API.Controllers
{
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

        //private Guid GetUserId()
        //{
        //    var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (!Guid.TryParse(userIdClaim, out var userId))
        //    {
        //        _logger.LogWarning("Не удалось получить userId из токена.");
        //        throw new UnauthorizedAccessException("Недействительный токен.");
        //    }

        //    return userId;
        //}

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            var user = await _userService.RegisterAsync(dto);
            if (user == null)
                return Conflict("Пользователь с таким email или именем уже существует.");

            _logger.LogInformation("Пользователь {Email} успешно зарегистрировался", dto.Username);
            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            _logger.LogInformation("Попытка входа для email: {Email}", dto.Email);

            var token = await _userService.LoginAsync(dto);
            if (token == null)
            {
                _logger.LogWarning("Неудачная попытка входа для {Email}", dto.Email);
                return Unauthorized("Неверный логин или пароль.");
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None, // Для кросс-доменных запросов можно изменить
                Expires = DateTimeOffset.UtcNow.AddMonths(6)
            };

            Response.Cookies.Append("AppCookie", token, cookieOptions);

            _logger.LogInformation("Пользователь {Email} успешно вошел", dto.Email);
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (Request.Cookies.ContainsKey("AppCookie"))
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                };

                Response.Cookies.Delete("AppCookie", cookieOptions);
                _logger.LogInformation("Пользователь вышел из аккаунта.");
            }
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }


        [Authorize]
        [HttpGet("infome")]
        public async Task<IActionResult> GetCurrentUser()
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

        //[Authorize]
        //[HttpGet("infome")]
        //public async Task<IActionResult> GetCurrentUser()
        //{
        //    var userId = GetUserId();
        //    _logger.LogInformation("Получение информации о текущем пользователе {UserId}", userId);

        //    var user = await _userService.GetByIdAsync(userId);
        //    if (user == null)
        //        return NotFound();

        //    return Ok(user);
        //}


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpPut("infome/name")]
        public async Task<IActionResult> Update([FromBody] UpdateUserDto dto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userId, out Guid UserId))
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Ошибка валидации данных при обновлении профиля");
                    return BadRequest(ModelState);
                }
                var success = await _userService.UpdateAsync(UserId, dto);
                _logger.LogInformation($"Пользователь с Id {UserId} пытается обновить свои данные (Email/Username)");
                if (!success)
                {
                    _logger.LogWarning($"Пользователь с Id {UserId} не найден при обновлении профиля");
                    return NotFound();
                }

                return Ok();
            }
            _logger.LogWarning("Попытка несанкционированного доступа при обновлении профиля");
            return Unauthorized();
        }

        [Authorize]
        [HttpPatch("infome/password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userId, out Guid UserId))
            {
                _logger.LogInformation($"Пользователь с Id {UserId} пытается обновить свой пароль");
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
                catch (InvalidOperationException)
                {
                    _logger.LogWarning($"Неудачная попытка смена пароля для пользователя с Id {UserId}");
                    return Conflict();
                }
            }
            _logger.LogWarning("Попытка несанкционированного доступа для обновления пароля");
            return Unauthorized();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/role")]
        public async Task<IActionResult> ChangeRole(Guid id, [FromBody] UpdateUserRoleDto dto)
        {
            var success = await _userService.ChangeUserRoleAsync(id, dto.Role);
            if (!success)
                return NotFound();

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _userService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
