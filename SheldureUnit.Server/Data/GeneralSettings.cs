using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SheldureUnit.Server.Data
{
    public class GeneralSettings
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string SchedulesTitle { get; set; }
        public string SchedulesDescription { get; set; }
        public string SchedulesLessons { get; set; }
        public string ShedulesParity { get; set; }
    }
}
