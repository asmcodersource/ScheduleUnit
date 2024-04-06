using Microsoft.EntityFrameworkCore;

namespace SheldureUnit.Server.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Schedule> Schedules { get; set; } = null!;
        

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}