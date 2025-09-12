namespace OnlineStore.Application.DTO
{
    public class ProductDto
    {
        public Guid Id { get; set; }           // Уникальный идентификатор продукта
        public string Name { get; set; } = default!;      // Название
        public string Description { get; set; } = default!; // Описание
        public decimal Price { get; set; }     // Цена
        public string ImageUrl { get; set; } = default!; // Ссылка на изображение

        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }
}
