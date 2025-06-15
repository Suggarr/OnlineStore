using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class CreateCartItemDto
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [Range(1, 10, ErrorMessage = "Количество должно быть от 1 до 10.")]
        public int Quantity { get; set; } = 1;
    }
}