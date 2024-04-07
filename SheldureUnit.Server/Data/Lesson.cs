using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace SheldureUnit.Server.Data
{
    public enum Day
    {
        Monday,
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


        [ForeignKey("SecondSubjectId"), AllowNull]
        public int? SecondSubjectId { get; set; }
        public Subject? SecondSubject { get; set; }
        public int? SecondClassRoomId { get; set; }
        public ClassRoom? SecondClassRoom { get; set; }
        public string? SecondLessonType { get; set; }


        [ForeignKey("ScheduleId")]
        public int ScheduleId { get; set; }
    }
}
