using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdatePasswordDto
    {
        [Required(ErrorMessage = "Старый пароль обязателен.")]
        public string OldPassword { get; set; } = default!;

        [Required(ErrorMessage = "Новый пароль обязателен.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Новый пароль должен содержать от 8 до 100 символов.")]
        public string NewPassword { get; set; } = default!;
    }
}
