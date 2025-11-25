using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = default!;

        [Required]
        [MaxLength(300)]
        public string Description { get; set; } = default!;

        [Range(0.01, 100000)]
        public decimal Price { get; set; }

        [Required]
        [Url]
        public string ImageUrl { get; set; } = default!;

        [Required]
        public Guid CategoryId { get; set; }
    }
}
