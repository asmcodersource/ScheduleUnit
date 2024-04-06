using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SheldureUnit.Server.Data
{
    public enum Day
    {
        Mondey,
        Tuesday, 
        Wednesday, 
        Thursday,
        Friday,
    }

    public class Lesson
    {
        [Key, Required]
        public int Id { get; set; }
        [Required] 
        public Day Day { get; set; }
        [Required]
        public int Number { get; set; }

        [Required, ForeignKey("Subject")]
        public int FirstSubjectRefId {  get; set; }
        [Required]
        public Subject? FirstSubject { get; set; }

        [Required, ForeignKey("Subject")]
        public int SecondSubjectRefId { get; set; }
        [Required]
        public Subject? SecondSubject { get; set; }

        [Required, ForeignKey("ClassRoom")]
        public int ClassRoomRefId { get; set; }
        [Required]
        public ClassRoom? ClassRoom { get; set; }

    }
}
