namespace OnlineStore.Domain.Entities
{
    public class CartItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public Guid UserId { get; set; }

        public Product Product { get; set; } = default!;
        public User User { get; set; } = default!;
    }
}
