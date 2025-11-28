using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class CreateCartItemDto
    {
        [Required(ErrorMessage = "Не указан идентификатор товара.")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "Количество обязательно.")]
        [Range(1, int.MaxValue, ErrorMessage = "Количество должно быть не меньше 1.")]
        public int Quantity { get; set; } = 1;
    }
}