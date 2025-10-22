using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;

namespace OnlineStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

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
                Secure = false, //true для https
                SameSite = SameSiteMode.Lax, // None для https
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
                    Secure = false, //true для https
                    SameSite = SameSiteMode.Lax // None для https
                };

                Response.Cookies.Delete("AppCookie", cookieOptions);
                _logger.LogInformation("Пользователь вышел из аккаунта.");
            }
            return NoContent();
        }
    }
}
