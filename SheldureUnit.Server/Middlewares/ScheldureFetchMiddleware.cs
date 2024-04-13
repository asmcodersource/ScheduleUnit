using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using SheldureUnit.Server.Data;
using Newtonsoft.Json.Linq;

namespace SheldureUnit.Server.Middlewares
{
    public class ScheldureFetchMiddleware
    {
        private readonly RequestDelegate _next;

        public ScheldureFetchMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, DatabaseContext dbContext)
        {
            if (context.Request.Method == "POST" && context.Request.Path == "/fetchScheldule")
            {
                using (var reader = new StreamReader(context.Request.Body))
                {
                    var requestBody = await reader.ReadToEndAsync();
                    var requestData = JObject.Parse(requestBody);
                    var data = dbContext.Schedules.Where<Schedule>((scheldule) => scheldule.Group == requestData["group"].ToString()).FirstOrDefault();

                    if (data == null)
                    {
                        context.Response.StatusCode = StatusCodes.Status404NotFound;
                        await context.Response.WriteAsync("Data not found");
                        return;
                    }

                    var lessons = dbContext.Lessons.Where(x => x.ScheduleId == data.Id).ToList();
                    foreach( var lesson in lessons)
                    {
                        if( lesson.FirstSubjectId is not null )
                            lesson.FirstSubject = dbContext.Subjects.Where(x => x.Id == lesson.FirstSubjectId).FirstOrDefault();
                        if (lesson.SecondSubjectId is not null)
                            lesson.SecondSubject = dbContext.Subjects.Where(x => x.Id == lesson.SecondSubjectId).FirstOrDefault();
                        if (lesson.FirstClassRoomId is not null)
                            lesson.FirstClassRoom = dbContext.ClassRooms.Where(x => x.Id == lesson.FirstClassRoomId).FirstOrDefault();
                        if (lesson.SecondClassRoomId is not null)
                            lesson.SecondClassRoom = dbContext.ClassRooms.Where(x => x.Id == lesson.SecondClassRoomId).FirstOrDefault();
                    }

                    data.Lessons = lessons;
                    var generalOptions = dbContext.GeneralSettings.First();

                    context.Response.StatusCode = StatusCodes.Status200OK;
                    context.Response.ContentType = "application/json";
                    var responseData = JsonConvert.SerializeObject(new { Scheldule = data, ScheduleGeneral= generalOptions });
                    await context.Response.WriteAsync(responseData);
                    return;
                }
            }

            // Передача запроса следующему middleware, если это не POST запрос
            await _next(context);
        }
    }
}
