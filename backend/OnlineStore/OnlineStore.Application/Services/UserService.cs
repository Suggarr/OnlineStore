using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Domain.Enums;

namespace OnlineStore.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<UserDto?> RegisterAsync(RegisterUserDto dto)
        {
            if (await _userRepository.ExistsByEmailAsync(dto.Email) ||
                await _userRepository.ExistsByUsernameAsync(dto.Username))
            {
                return null;
            }

            var user = new User
            {
                UserName = dto.Username,
                Email = dto.Email.ToLowerInvariant(),
                PasswordHash = await _passwordHasher.HashPassword(dto.Password),
            };

            await _userRepository.AddAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<string?> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null) return null;

            var isPasswordValid = await _passwordHasher.VerifyPassword(user.PasswordHash, dto.Password);
            if (!isPasswordValid) return null;

            var token = _jwtTokenService.GenerateToken(user);
            return token;
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.UserName,
                Email = u.Email,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt
            });
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailExists = await _userRepository.ExistsByEmailAsync(dto.Email);
                if (emailExists)
                    throw new InvalidOperationException("Email уже используется другим пользователем.");
            }

            if (user.UserName != dto.Username)
            {
                var usernameExists = await _userRepository.ExistsByUsernameAsync(dto.Username);
                if (usernameExists)
                    throw new InvalidOperationException("Имя пользователя уже занято.");
            }

            user.UserName = dto.Username;
            user.Email = dto.Email.ToLowerInvariant();

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task UpdatePasswordAsync(Guid id, UpdatePasswordDto updateUserPasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден.");
            }

            var isOldPasswordValid = await _passwordHasher.VerifyPassword(user.PasswordHash, updateUserPasswordDto.OldPassword);
            if (!isOldPasswordValid)
            {
                throw new InvalidOperationException("Старый пароль неверный.");
            }

            user.PasswordHash = await _passwordHasher.HashPassword(updateUserPasswordDto.NewPassword);
            await _userRepository.UpdateAsync(user);
        }


        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            await _userRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ChangeUserRoleAsync(Guid id, UserRole newRole)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.Role = newRole;
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
}