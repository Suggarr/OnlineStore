namespace OnlineStore.Application.DTO
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Image { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
