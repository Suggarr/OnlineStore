namespace OnlineStore.Domain.Entities
{
    public class CartItem
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Уникальный ID записи в корзине

        public Guid ProductId { get; set; }            // ID продукта (из таблицы Products)
        public string ProductName { get; set; } = string.Empty; // Название продукта (копия на момент добавления в корзину)
        public decimal Price { get; set; }             // Цена продукта на момент добавления
        public int Quantity { get; set; }              // Количество

        public string? ImageUrl { get; set; }          // URL изображения для отображения

        public Guid UserId { get; set; }  // Связь с пользователем

        public Product Product { get; set; } = default!;
        public User User { get; set; } = default!;
    }
}
