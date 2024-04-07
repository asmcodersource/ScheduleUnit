using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SheldureUnit.Server.Data
{
    public class Subject
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(256)]
        public string SubjectName { get; set; }
        public string? SubjectDescription { get; set; }

    }
}
