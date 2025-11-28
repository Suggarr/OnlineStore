using OnlineStore.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace OnlineStore.Application.DTO
{
    public class UpdateUserRoleDto
    {
        [Required(ErrorMessage = "Роль пользователя обязательна.")]
        [Range((int)UserRole.User, (int)UserRole.Admin, ErrorMessage = "Роль может быть только 'User' или 'Admin'.")]
        public UserRole Role { get; set; }
    }
}