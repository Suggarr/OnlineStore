using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.DTO
{
    public class FavoriteDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public ProductDto Product { get; set; } = default!;   
    }
}
