using OnlineStore.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdateUserRoleDto
    {
        [Required]
        [Range((int)UserRole.User, (int)UserRole.Admin, ErrorMessage = "Нет такой роли.")]
        public UserRole Role { get; set; }
    }
}