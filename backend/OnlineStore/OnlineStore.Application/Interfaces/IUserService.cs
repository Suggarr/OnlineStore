using OnlineStore.Application.DTO;
using OnlineStore.Domain.Enums;

namespace OnlineStore.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> RegisterAsync(RegisterUserDto dto);
        Task<UserDto?> LoginAsync(LoginUserDto dto);
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<bool> UpdateAsync(Guid id, UpdateUserDto dto);
        Task<bool> UpdatePasswordAsync(Guid id, string newPassword);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ChangeUserRoleAsync(Guid id, UserRole newRole);
    }
}
