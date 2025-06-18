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
                Email = dto.Email,
                PasswordHash = await _passwordHasher.HashPassword(dto.Password),
                Role = UserRole.User
            };

            await _userRepository.AddAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null) return null;

            var isPasswordValid = await _passwordHasher.VerifyPassword(user.PasswordHash, dto.Password);
            if (!isPasswordValid) return null;

            var token = _jwtTokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            };
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
                Role = user.Role.ToString()
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
                Role = u.Role.ToString()
            });
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.UserName = dto.Username;
            user.Email = dto.Email;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> UpdatePasswordAsync(Guid id, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.PasswordHash = await _passwordHasher.HashPassword(newPassword);
            await _userRepository.UpdateAsync(user);
            return true;
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