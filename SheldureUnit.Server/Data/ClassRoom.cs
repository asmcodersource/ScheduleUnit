using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SheldureUnit.Server.Data
{
    public class ClassRoom
    {
        [Key, Required]
        public int Id { get; set; }
        [Required, StringLength(256)]
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
