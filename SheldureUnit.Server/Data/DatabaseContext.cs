using Microsoft.EntityFrameworkCore;

namespace SheldureUnit.Server.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Schedule> Schedules { get; set; } = null!;
        public DbSet<Subject> Subjects { get; set; } = null!;
        public DbSet<ClassRoom> ClassRooms { get; set; } = null!;
        public DbSet<Lesson> Lessons { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;


        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Генерация тестовых данных для ClassRoom
            modelBuilder.Entity<ClassRoom>().HasData(
                new ClassRoom { Id = 1, Name = "Classroom 101", Description = "Description for Classroom 101" },
                new ClassRoom { Id = 2, Name = "Classroom 102", Description = "Description for Classroom 102" },
                new ClassRoom { Id = 3, Name = "Classroom 103", Description = "Description for Classroom 103" }
            // Добавьте столько объектов ClassRoom, сколько вам нужно
            );

            // Генерация тестовых данных для Subject
            modelBuilder.Entity<Subject>().HasData(
                new Subject { Id = 1, SubjectName = "Mathematics", SubjectDescription = "Description for Mathematics" },
                new Subject { Id = 2, SubjectName = "Science", SubjectDescription = "Description for Science" },
                new Subject { Id = 3, SubjectName = "History", SubjectDescription = "Description for History" },
                new Subject { Id = 4, SubjectName = "Literature", SubjectDescription = "Description for Literature" }
            // Добавьте столько объектов Subject, сколько вам нужно
            );

            // Генерация тестовых данных для Schedule
            modelBuilder.Entity<Schedule>().HasData(
                new Schedule { Id = 1, Group = "Group A", Name = "Schedule for Group A", Duration = "1 hour" }
            // Добавьте столько объектов Schedule, сколько вам нужно
            );

            // Генерация тестовых данных для Lesson
            modelBuilder.Entity<Lesson>().HasData(
                // Уроки для первой группы
                new Lesson { Id = 1, Day = Day.Monday, Number = 1, FirstSubjectId = 1, FirstClassRoomId = 1, FirstLessonType = "Lecture", ScheduleId = 1 },
                new Lesson { Id = 2, Day = Day.Monday, Number = 2, FirstSubjectId = 2, FirstClassRoomId = 2, FirstLessonType = "Lab", ScheduleId = 1 },
                new Lesson { Id = 3, Day = Day.Tuesday, Number = 1, FirstSubjectId = 3, FirstClassRoomId = 3, FirstLessonType = "Lecture", ScheduleId = 1 },
                new Lesson { Id = 4, Day = Day.Tuesday, Number = 2, FirstSubjectId = 4, FirstClassRoomId = 1, FirstLessonType = "Lab", ScheduleId = 1 },
                // Уроки с двумя предметами
                new Lesson { Id = 5, Day = Day.Wednesday, Number = 1, FirstSubjectId = 1, SecondSubjectId = 2, FirstClassRoomId = 2, SecondClassRoomId = 3, FirstLessonType = "Lab", SecondLessonType = "Lecture", ScheduleId = 1 },
                new Lesson { Id = 6, Day = Day.Wednesday, Number = 2, FirstSubjectId = 3, SecondSubjectId = 4, FirstClassRoomId = 3, SecondClassRoomId = 1, FirstLessonType = "Lecture", SecondLessonType = "Lab", ScheduleId = 1 }
            // Добавьте столько объектов Lesson, сколько вам нужно
            );
        }


    }
}