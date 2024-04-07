using Microsoft.EntityFrameworkCore;

namespace SheldureUnit.Server.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Schedule> Schedules { get; set; } = null!;
        public DbSet<Subject> Subjects { get; set; } = null!;
        public DbSet<ClassRoom> Classrooms { get; set; } = null!;
        public DbSet<Lesson> Lessons { get; set; } = null!;


        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.ClassRoom)
                .WithMany(c => c.Lessons)
                .HasForeignKey(l => l.ClassRoomId);

            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.FirstSubject)
                .WithMany(s => s.FirstSubjectLessons) // используем первое навигационное свойство
                .HasForeignKey(l => l.FirstSubjectId);

            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.SecondSubject)
                .WithMany(s => s.SecondSubjectLessons) // используем второе навигационное свойство
                .HasForeignKey(l => l.SecondSubjectId);

            modelBuilder.Entity<Schedule>()
                .HasMany(s => s.Subjects)
                .WithOne()
                .HasForeignKey("ScheduleId"); // Связь один ко многим без навигационного свойства

            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Subject>().HasData(
                new Subject { Id = 1, SubjectName = "Mathematics", SubjectDescription = "Study of numbers and shapes" },
                new Subject { Id = 2, SubjectName = "Physics", SubjectDescription = "Study of matter, energy, and the fundamental forces of nature" },
                new Subject { Id = 3, SubjectName = "Chemistry", SubjectDescription = "Study of the properties, composition, and behavior of matter" }
            );

            modelBuilder.Entity<ClassRoom>().HasData(
                new ClassRoom { Id = 1, Name = "Classroom 101", Description = "Standard classroom" }
            );

            modelBuilder.Entity<Schedule>().HasData(
                new Schedule { Id = 1, Group = "Group 1", Name = "Spring Semester", Duration = "3 months" }
            );

            modelBuilder.Entity<Lesson>().HasData(
                new Lesson { Id = 1, Day = Day.Monday, Number = 1, ClassRoomId = 1, FirstSubjectId = 1, SecondSubjectId = 2 },
                new Lesson { Id = 2, Day = Day.Tuesday, Number = 2, ClassRoomId = 1, FirstSubjectId = 2, SecondSubjectId = 3 },
                new Lesson { Id = 3, Day = Day.Wednesday, Number = 3, ClassRoomId = 1, FirstSubjectId = 3, SecondSubjectId = 1 },
                new Lesson { Id = 4, Day = Day.Thursday, Number = 4, ClassRoomId = 1, FirstSubjectId = 1, SecondSubjectId = 2 },
                new Lesson { Id = 5, Day = Day.Friday, Number = 5, ClassRoomId = 1, FirstSubjectId = 2, SecondSubjectId = 3 }
            );
        }

    }
}