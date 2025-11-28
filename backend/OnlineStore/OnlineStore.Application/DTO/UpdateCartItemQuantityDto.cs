using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.DTO
{
    public class UpdateCartItemQuantityDto
    {
        [Required(ErrorMessage = "Количество обязательно.")]
        [Range(1, int.MaxValue, ErrorMessage = "Количество должно быть не меньше 1.")]
        public int Quantity { get; set; }
    }
}
