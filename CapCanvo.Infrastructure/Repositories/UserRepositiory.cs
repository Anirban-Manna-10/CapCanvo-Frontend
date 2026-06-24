// CapCanvo.Infrastructure/Repositories/UserRepository.cs
using MongoDB.Driver;
using CapCanvo.Core.Entities;
using CapCanvo.Core.Interfaces;
using CapCanvo.Infrastructure.Persistence;

namespace CapCanvo.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext _context;

        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByClerkIdAsync(string clerkId)
        {
            return await _context.Users
                .Find(u => u.ClerkId == clerkId)
                .FirstOrDefaultAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }
    }
}