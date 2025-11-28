using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Название категории обязательно.")]
        [MinLength(3, ErrorMessage = "Название категории должно содержать минимум 3 символа.")]
        [MaxLength(100, ErrorMessage = "Название категории не должно превышать 100 символов.")]
        public string Name { get; set; } = default!;

        [Required(ErrorMessage = "Описание обязательно.")]
        [MinLength(5, ErrorMessage = "Описание должно содержать минимум 5 символов.")]
        [MaxLength(600, ErrorMessage = "Описание не должно превышать 600 символов.")]
        public string Description { get; set; } = default!;

        [Required(ErrorMessage = "URL изображения обязателен.")]
        [Url(ErrorMessage = "Неверный формат URL изображения.")]
        [MinLength(10, ErrorMessage = "Ссылка изображения слишком короткая.")]
        [MaxLength(300, ErrorMessage = "URL изображения не должен превышать 300 символов.")]
        public string Image { get; set; } = default!;
    }
}
