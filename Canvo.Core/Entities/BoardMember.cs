using CapCanvo.Core.Common;

namespace CapCanvo.Core.Entities;

public class BoardMember : IdModel
{
    public string BoardId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = "viewer"; // owner | editor | viewer
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}