using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("ClassRoomId")]
        public int ClassRoomId { get; set; }
        public ClassRoom ClassRoom { get; set; } // Навигационное свойство

        [ForeignKey("FirstSubjectId")]
        public int FirstSubjectId { get; set; }
        public Subject FirstSubject { get; set; } // Навигационное свойство

        [ForeignKey("SecondSubjectId")]
        public int SecondSubjectId { get; set; }
        public Subject SecondSubject { get; set; } // Навигационное свойство
    }
}
