using Microsoft.AspNetCore.Authorization;
using SheldureUnit.Server.Data;
using System.Security.Claims;
using System.Text.Json;
using System.Text;
using SheldureUnit.Server.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SheldureUnit.Server.Middlewares
{
    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, DatabaseContext dbContext)
        {
            if (context.Request.Method == "POST" && context.Request.Path == "/login")
                await LoginHandler(context, dbContext);
            else if (context.Request.Method == "POST" && context.Request.Path == "/tokenvalidation")
                await TokenValidationHandler(context, dbContext);
            else 
                await _next(context);
        }

        public static class AuthOptions
        {
            public const string ISSUER = "MyAuthServer";
            public const string AUDIENCE = "MyAuthClient";
            const string KEY = "mysupersecret_secretkey!12312123456789012345678901234";
            public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
        }

        public static async Task LoginHandler(HttpContext context, DatabaseContext db)
        {
            JsonDocument document = await JsonDocument.ParseAsync(context.Request.Body);
            var username = document.RootElement.GetProperty("username").GetString();
            var password = document.RootElement.GetProperty("password").GetString();
            if (username is null || password is null)
            {
                await SendErrorMessage(context, 400, "Wrong request data format");
            }
            else
            {
                db.Users.Where((x) => x.Id == 1);
                var query = from u in db.Users
                            where u.Login == username && u.Password == password
                            select u;
                if (query.Count() == 0)
                    await SendErrorMessage(context, 403, "Wrong login or password");
                else
                {
                    var user = query.First();
                    await AuthorizeClient(context, user);
                }
            }
        }

        private static async Task AuthorizeClient(HttpContext context, User user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Login),
            };
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    claims: claims,
                    expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new { access_token = encodedJwt };
            await context.Response.WriteAsJsonAsync(response);
        }

        public static async Task SendErrorMessage(HttpContext context, int code, string message)
        {
            context.Response.StatusCode = code;
            await context.Response.WriteAsJsonAsync(new { errorMessage = message });
        }


        [Authorize]
        public static async Task TokenValidationHandler(HttpContext context, DatabaseContext db)
        {
            var name = context.User.Claims.First((claim) => claim.Type == ClaimTypes.Name).Value;
            var query = from u in db.Users
                        where u.Login == name
                        select u;
            if (query.Count() == 0)
            {
                await SendErrorMessage(context, 403, "Token has wrong claims");
                return;
            }
            var user = query.First();
            var response = new { user.Id, user.Login };
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
