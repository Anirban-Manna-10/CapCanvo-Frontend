// CapCanvo.Infrastructure/Services/UserService.cs
using CapCanvo.Core.DTOs;
using CapCanvo.Core.Entities;
using CapCanvo.Core.Interfaces;

namespace CapCanvo.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse> SyncUserAsync(string clerkId, SyncUserRequest request)
        {
            var existing = await _userRepository.GetByClerkIdAsync(clerkId);

            if (existing != null)
            {
                // keep Mongo in sync with whatever changed on Clerk's side
                existing.Email = request.Email;
                existing.DisplayName = request.DisplayName;
                existing.AvatarUrl = request.AvatarUrl;

                await _userRepository.UpdateAsync(existing);
                return ToResponse(existing);
            }

            var user = new User
            {
                ClerkId = clerkId,
                Email = request.Email,
                DisplayName = request.DisplayName,
                AvatarUrl = request.AvatarUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);
            return ToResponse(user);
        }

        private static UserResponse ToResponse(User user) => new()
        {
            Id = user.Id,
            ClerkId = user.ClerkId,
            Email = user.Email,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt
        };
    }
}