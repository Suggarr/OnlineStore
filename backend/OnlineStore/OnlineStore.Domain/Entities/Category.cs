namespace OnlineStore.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Image { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


        public ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
