using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.DTO
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = default!;
        public UserDto User { get; set; } = default!;
    }
}