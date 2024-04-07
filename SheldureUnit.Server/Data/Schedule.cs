using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SheldureUnit.Server.Data
{
    public class Schedule
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(256)]
        public string Group { get; set; }

        [Required, StringLength(256)]
        public string Name { get; set; }

        [Required, StringLength(256)]
        public string Duration { get; set; }

        public ICollection<Subject> Subjects { get; set; } = new List<Subject>(); // Навигационное свойство
    }
}
