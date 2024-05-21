using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SheldureUnit.Server.Data;
using SheldureUnit.Server.Middlewares;
using Microsoft.EntityFrameworkCore;

string connectionString = "Server=localhost;Database=ScheduleUnit;Uid=admin;Pwd=123123;";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DatabaseContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = AuthMiddleware.AuthOptions.ISSUER,
            ValidateAudience = true,
            ValidAudience = AuthMiddleware.AuthOptions.AUDIENCE,
            ValidateLifetime = true,
            IssuerSigningKey = AuthMiddleware.AuthOptions.GetSymmetricSecurityKey(),
            ValidateIssuerSigningKey = true
        };
    });




var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AdminPanelMiddleware>();
app.UseMiddleware<ScheldureFetchMiddleware>();
app.UseMiddleware<AuthMiddleware>();
app.MapFallbackToFile("/index.html");
app.Run();
