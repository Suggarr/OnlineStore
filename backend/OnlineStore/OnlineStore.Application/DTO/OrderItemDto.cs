namespace OnlineStore.Application.DTO
{
    public class OrderItemDto
    {
        public string ProductName { get; set; } = default!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}
