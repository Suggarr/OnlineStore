using OnlineStore.Application.DTO;
using OnlineStore.Domain.Enums;

namespace OnlineStore.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> RegisterAsync(RegisterUserDto dto);
        Task<string?> LoginAsync(LoginUserDto dto);  // возвращаем только JWT, куку поставим в контроллере
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<bool> UpdateAsync(Guid id, UpdateUserDto dto);
        Task<bool> UpdatePasswordAsync(Guid id, string newPassword);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ChangeUserRoleAsync(Guid id, UserRole newRole);
    }
}
