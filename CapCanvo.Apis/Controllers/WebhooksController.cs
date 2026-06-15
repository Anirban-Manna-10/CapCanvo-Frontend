using CapCanvo.Core.Entities;
using CapCanvo.Infrastructure.Config;
using CapCanvo.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Svix;
using System.Net;
using System.Text.Json;

namespace CapCanvo.API.Controllers;

[ApiController]
[Route("api/webhooks")]
public class WebhooksController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ClerkSettings _clerkSettings;

    public WebhooksController(
        MongoDbContext context,
        IOptions<ClerkSettings> clerkSettings)
    {
        _context = context;
        _clerkSettings = clerkSettings.Value;
    }

    [HttpPost("clerk")]
    public async Task<IActionResult> ClerkWebhook()
    {
        // Step 1 — Read raw body
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();

        // Step 2 — Verify webhook signature
        var svixId = Request.Headers["svix-id"].ToString();
        var svixTimestamp = Request.Headers["svix-timestamp"].ToString();
        var svixSignature = Request.Headers["svix-signature"].ToString();

        if (string.IsNullOrEmpty(svixId) ||
            string.IsNullOrEmpty(svixTimestamp) ||
            string.IsNullOrEmpty(svixSignature))
            return BadRequest("Missing svix headers");

        try
        {
            var headers = new WebHeaderCollection();
            headers.Set("svix-id", svixId);
            headers.Set("svix-timestamp", svixTimestamp);
            headers.Set("svix-signature", svixSignature);

            var wh = new Webhook(_clerkSettings.WebhookSecret);
            wh.Verify(body, headers);
        }
        catch
        {
            return Unauthorized("Invalid webhook signature");
        }

        // Step 3 — Handle event
        var payload = JsonSerializer.Deserialize<JsonElement>(body);
        var eventType = payload.GetProperty("type").GetString();

        if (eventType == "user.created")
        {
            var data = payload.GetProperty("data");
            var emailAddresses = data.GetProperty("email_addresses");
            var email = emailAddresses.GetArrayLength() > 0
                ? emailAddresses[0]
                    .GetProperty("email_address")
                    .GetString() ?? string.Empty
                : string.Empty;

            var user = new User
            {
                ClerkId = data.GetProperty("id").GetString() ?? string.Empty,
                Email = email,
                DisplayName = (data.GetProperty("first_name").GetString() ?? "") + " " + (data.GetProperty("last_name").GetString() ?? ""),
                AvatarUrl = data.GetProperty("image_url").GetString() ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.InsertOneAsync(user);
        }

        if (eventType == "user.updated")
        {
            var data = payload.GetProperty("data");
            var clerkId = data.GetProperty("id").GetString();

            var filter = MongoDB.Driver.Builders<User>
                .Filter.Eq(u => u.ClerkId, clerkId);

            var update = MongoDB.Driver.Builders<User>
                .Update
                .Set(u => u.Email, data
                    .GetProperty("email_addresses")[0]
                    .GetProperty("email_address")
                    .GetString() ?? string.Empty)
                .Set(u => u.DisplayName,
                    (data.GetProperty("first_name").GetString() ?? "") +
                    " " +
                    (data.GetProperty("last_name").GetString() ?? ""))
                .Set(u => u.AvatarUrl, data
                    .GetProperty("image_url")
                    .GetString() ?? string.Empty);

            await _context.Users.UpdateOneAsync(filter, update);
        }

        return Ok();
    }
}