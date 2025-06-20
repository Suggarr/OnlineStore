namespace OnlineStore.Application.DTO
{
    public class UpdatePasswordDto
    {
        public string OldPassword { get; set; } = default!;
        public string NewPassword { get; set; } = default!;
    }
}
