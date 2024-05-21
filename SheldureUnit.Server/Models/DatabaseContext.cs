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
        public DbSet<GeneralSettings> GeneralSettings { get; set; } = null!;


        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Login = "admin", Password = "123123"}
            );

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
                new Schedule { 
                    Id = 1, 
                    Group = "Group A", 
                    Name = "Schedule for Group A", 
                    Duration = "1 hour",
                    Message = "Dear students!\r\n\r\nWe welcome you with delight to a new week of study filled with opportunities and prospects! This time around, you'll find another class schedule that presents an important kaleidoscope of academic and creative opportunities. We are proud to invite you to approach this week with full enthusiasm and a desire to learn more.",
                }
            // Добавьте столько объектов Schedule, сколько вам нужно
            );

            modelBuilder.Entity<GeneralSettings>().HasData(
                new GeneralSettings
                {
                    Id = 1,
                    SchedulesTitle = "Schedules",
                    SchedulesDescription = "This is a couples program created using the Schedules Unit module. Here you can get information about lessons on different days of the week, as well as some additional information about them (audience, lesson type, and subject-related link). The current lesson is highlighted in color. Additional information about a particular object can be found by hovering the mouse over the object. The name of the item can be a hyperlink to some other resource on the Internet.",
                    SchedulesLessons = "[{\"id\":\"1\",\"t1\":{\"hours\":\"9\",\"minutes\":\"00\"},\"t2\":{\"hours\":\"10\",\"minutes\":\"20\"}},{\"id\":\"2\",\"t1\":{\"hours\":\"10\",\"minutes\":\"30\"},\"t2\":{\"hours\":\"11\",\"minutes\":\"50\"}},{\"id\":\"3\",\"t1\":{\"hours\":\"12\",\"minutes\":\"20\"},\"t2\":{\"hours\":\"13\",\"minutes\":\"40\"}},{\"id\":\"4\",\"t1\":{\"hours\":\"13\",\"minutes\":\"50\"},\"t2\":{\"hours\":\"15\",\"minutes\":\"10\"}}]",
                    ShedulesParity = "odd"
                }
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