using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Domain.Entities
{
    public class Favorite
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; } = default;
        public Guid ProductId { get; set; } = default;

        public User User { get; set; } = default!;
        public Product Product { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
