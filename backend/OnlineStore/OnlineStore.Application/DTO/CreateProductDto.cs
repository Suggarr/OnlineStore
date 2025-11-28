using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Название товара обязательно.")]
        [MinLength(3, ErrorMessage = "Название товара должно содержать минимум 3 символа.")]
        [MaxLength(100, ErrorMessage = "Название товара не должно превышать 100 символов.")]//было 50
        public string Name { get; set; } = default!;

        [Required(ErrorMessage = "Описание товара обязательно.")]
        [MinLength(5, ErrorMessage = "Описание товара должно содержать минимум 5 символов.")]
        [MaxLength(500, ErrorMessage = "Описание товара не должно превышать 300 символов.")]
        public string Description { get; set; } = default!;

        [Range(0.01, 100000, ErrorMessage = "Цена должна быть в диапазоне от 0.01 до 100000.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "URL изображения обязателен.")]
        [Url(ErrorMessage = "Неверный формат URL изображения.")]
        [MinLength(10, ErrorMessage = "Ссылка изображения слишком короткая.")]
        [MaxLength(300, ErrorMessage = "URL изображения не должен превышать 300 символов.")]
        public string ImageUrl { get; set; } = default!;

        [Required(ErrorMessage = "Категория обязательна.")]
        public Guid CategoryId { get; set; }
    }
}
