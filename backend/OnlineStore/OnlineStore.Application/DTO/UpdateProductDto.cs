using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdateProductDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = default!;

        [Range(0.01, 100000)]
        public decimal Price { get; set; }

        [Required]
        [Url]
        public string ImageUrl { get; set; } = default!;
    }
}
