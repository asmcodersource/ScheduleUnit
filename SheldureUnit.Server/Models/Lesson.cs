using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace SheldureUnit.Server.Data
{
    public enum Day
    {
        Monday = 0,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
    }

    public class Lesson
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public Day Day { get; set; }
        [Required]
        public int Number { get; set; }


        [ForeignKey("FirstSubjectId"), AllowNull]
        public int? FirstSubjectId { get; set; }
        public Subject? FirstSubject { get; set; }
        public int? FirstClassRoomId { get; set; }
        public ClassRoom? FirstClassRoom { get; set; }
        public string? FirstLessonType { get; set; }
        public string? FirstLessonLink { get; set; }


        [ForeignKey("SecondSubjectId"), AllowNull]
        public int? SecondSubjectId { get; set; } = null;
        public Subject? SecondSubject { get; set; } = null;
        public int? SecondClassRoomId { get; set; } = null;
        public ClassRoom? SecondClassRoom { get; set; } = null;
        public string? SecondLessonType { get; set; } = null;
        public string? SecondLessonLink { get; set; } = null;


        [ForeignKey("ScheduleId")]
        public int ScheduleId { get; set; }
    }
}
