using System.Security.Cryptography;
using System.Text;
using OnlineStore.Application.Interfaces;

namespace OnlineStore.Infrastructure.Data
{
    public class PasswordHasher : IPasswordHasher
    {
        public Task<string> HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            var result = Convert.ToBase64String(hash);
            return Task.FromResult(result);
        }

        public async Task<bool> VerifyPassword(string hashedPassword, string providedPassword)
        {
            var providedHash = await HashPassword(providedPassword);
            return hashedPassword == providedHash;
        }
    }
}
