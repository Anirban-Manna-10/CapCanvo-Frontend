using CapCanvo.Core.Entities;
using CapCanvo.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace CapCanvo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbContext _context;

    public HealthController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var userCount = _context.Users.CountDocuments(Builders<User>.Filter.Empty);
        return Ok(new { status = "MongoDB connected ✅", users = userCount });
    }
}