using CapCanvo.Core.Common;

namespace CapCanvo.Core.Entities;

public class Board : IdModel
{
    public string Title { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public string ShareToken { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}