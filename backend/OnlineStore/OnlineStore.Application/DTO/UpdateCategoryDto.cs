using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdateCategoryDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [MaxLength(500)]
        public string Description { get; set; } = default!;

        [Required]
        [Url]
        public string Image { get; set; } = default!;
    }
}
