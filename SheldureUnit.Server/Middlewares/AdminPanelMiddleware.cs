using Newtonsoft.Json.Linq;
using SheldureUnit.Server.Data;
using System.Reflection.PortableExecutable;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using SheldureUnit.Server.Data;
using Newtonsoft.Json.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace SheldureUnit.Server.Middlewares
{
    public class AdminPanelMiddleware
    {
        private readonly RequestDelegate _next;

        public AdminPanelMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        [Authorize]
        public async Task Invoke(HttpContext context, DatabaseContext dbContext)
        {
            if (context.Request.Method == "POST" && context.Request.Path == "/subjects")
                await SubjectsRequestInvoke(context, dbContext);
            else if (context.Request.Method == "POST" && context.Request.Path == "/classrooms")
                await ClassRoomsRequestInvoke(context, dbContext);
            else if (context.Request.Method == "POST" && context.Request.Path == "/schedules")
                await SchedulesRequestInvoke(context, dbContext);
            else if (context.Request.Method == "POST" && context.Request.Path == "/general")
                await GeneralRequestInvoke(context, dbContext);
            else
                await _next(context);
        }

        public async Task SubjectsRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {
            using (var reader = new StreamReader(context.Request.Body))
            {
                var requestBody = await reader.ReadToEndAsync();
                var requestData = JObject.Parse(requestBody);
                if (requestData["type"].ToString() == "get")
                {
                    var subjectsList = dbContext.Subjects.ToList();
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    context.Response.ContentType = "application/json";
                    var responseData = JsonConvert.SerializeObject(subjectsList);
                    await context.Response.WriteAsync(responseData);
                }
                else if (requestData["type"].ToString() == "update")
                {
                    var id = requestData["subject"]["Id"].ToString();
                    var name = requestData["subject"]["SubjectName"].ToString();
                    var description = requestData["subject"]["SubjectDescription"].ToString();
                    var updatedSubject = new Subject { Id = Convert.ToInt32(id), SubjectName = name, SubjectDescription = description };
                    dbContext.Subjects.Update(updatedSubject);
                    dbContext.SaveChanges();
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{}");
                }
                else if (requestData["type"].ToString() == "delete")    
                {
                    var id = Convert.ToInt32(requestData["id"].ToString());
                    var removeSubject = dbContext.Subjects.Where(x => x.Id == id).FirstOrDefault();
                    if (removeSubject is not null)
                    {
                        var lessons = dbContext.Lessons.Where(x => x.FirstSubjectId == id || x.SecondSubjectId == id).ToList();
                        dbContext.Lessons.RemoveRange(lessons);
                        dbContext.Subjects.Remove(removeSubject);
                        dbContext.SaveChanges();
                    }
                } else if (requestData["type"].ToString() == "create")
                {
                    var name = requestData["subject"]["SubjectName"].ToString();
                    var description = requestData["subject"]?["SubjectDescription"]?.ToString();
                    var creatingSubject = new Subject { SubjectName = name, SubjectDescription = description };
                    dbContext.Add(creatingSubject);
                    dbContext.SaveChanges();
                }
            }
        }

        public async Task ClassRoomsRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {

        }

        public async Task SchedulesRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {

        }

        public async Task GeneralRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {

        }
    }
}
