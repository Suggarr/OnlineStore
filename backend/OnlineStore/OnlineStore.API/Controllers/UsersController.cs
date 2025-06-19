using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using OnlineStore.Domain.Enums;

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

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userService.RegisterAsync(dto);
            if (user == null)
                return Conflict("Пользователь с таким email или именем уже существует.");

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
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
            return NoContent();
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (Request.Cookies.ContainsKey("AppCookie"))
            {
                Response.Cookies.Delete("AppCookie");
                _logger.LogInformation("Кука удалена. Пользователь разлогинен.");
            }
            return NoContent();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _userService.UpdateAsync(id, dto);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [Authorize]
        [HttpPut("{id}/password")]
        public async Task<IActionResult> UpdatePassword(Guid id, [FromBody] string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
                return BadRequest("Пароль не должен быть пустым.");

            var success = await _userService.UpdatePasswordAsync(id, newPassword);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(Guid id, [FromBody] UpdateUserRoleDto dto)
        {
            var success = await _userService.ChangeUserRoleAsync(id, dto.Role);
            if (!success)
                return NotFound();

            return NoContent();
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
