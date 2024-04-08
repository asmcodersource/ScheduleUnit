using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SheldureUnit.Server.Data
{
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(256)]
        public string Login { get; set; }
        
        [Required, StringLength(256)]
        public string Password { get; set; }

    }
}
