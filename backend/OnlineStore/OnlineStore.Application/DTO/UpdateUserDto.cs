using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.DTO
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Имя пользователя обязательно.")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Имя пользователя должно содержать от 3 до 30 символов.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email обязателен.")]
        [EmailAddress(ErrorMessage = "Введите корректный email.")]
        public string Email { get; set; } = string.Empty;
    }

}
