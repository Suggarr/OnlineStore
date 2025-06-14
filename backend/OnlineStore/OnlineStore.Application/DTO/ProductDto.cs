namespace OnlineStore.Application.DTO
{
    public class ProductDto
    {
        public Guid Id { get; set; }           // Уникальный идентификатор продукта
        public string Name { get; set; }       // Название
        public string Description { get; set; } // Описание
        public decimal Price { get; set; }     // Цена
        public string ImageUrl { get; set; }   // Ссылка на изображение
    }
}
