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
        [Required]
        //[Range(1, 10, ErrorMessage = "Количество должно быть от 1 до 10.")]
        public int Quantity { get; set; }
    }
}
