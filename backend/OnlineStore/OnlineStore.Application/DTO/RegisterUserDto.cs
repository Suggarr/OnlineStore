using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Имя пользователя обязательно.")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Имя пользователя должно содержать от 3 до 30 символов.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email обязателен.")]
        [EmailAddress(ErrorMessage = "Введите корректный email.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Пароль должен содержать от 8 до 100 символов.")]
        public string Password { get; set; } = string.Empty;
    }
}
