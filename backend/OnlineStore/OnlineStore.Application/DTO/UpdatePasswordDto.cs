using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = default!;

        [Required]
        [MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов.")]//Пароль должен быть не короче 8 символов
        public string NewPassword { get; set; } = default!;
    }
}
