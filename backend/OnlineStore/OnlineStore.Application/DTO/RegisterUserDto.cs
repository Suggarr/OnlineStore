using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.DTO
{
    public class RegisterUserDto
    {
        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Имя пользователя должно содержать от 6 до 30 символов.")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Введите корректный email.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов.")]//Пароль должен быть не короче 8 символов
        public string Password { get; set; } = string.Empty;

    }
}
