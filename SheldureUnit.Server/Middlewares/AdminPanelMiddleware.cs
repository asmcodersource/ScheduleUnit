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
                    dbContext.Subjects.Add(creatingSubject);
                    dbContext.SaveChanges();
                }
            }
        }

        public async Task ClassRoomsRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {
            using (var reader = new StreamReader(context.Request.Body))
            {
                var requestBody = await reader.ReadToEndAsync();
                var requestData = JObject.Parse(requestBody);
                if (requestData["type"].ToString() == "get")
                {
                    var subjectsList = dbContext.ClassRooms.ToList();
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    context.Response.ContentType = "application/json";
                    var responseData = JsonConvert.SerializeObject(subjectsList);
                    await context.Response.WriteAsync(responseData);
                }
                else if (requestData["type"].ToString() == "update")
                {
                    var id = requestData["room"]["Id"].ToString();
                    var name = requestData["room"]["Name"].ToString();
                    var description = requestData["room"]["Description"].ToString();
                    var updatedSubject = new ClassRoom { Id = Convert.ToInt32(id), Name = name, Description = description };
                    dbContext.ClassRooms.Update(updatedSubject);
                    dbContext.SaveChanges();
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{}");
                }
                else if (requestData["type"].ToString() == "delete")
                {
                    var id = Convert.ToInt32(requestData["id"].ToString());
                    var removeClassRoom = dbContext.ClassRooms.Where(x => x.Id == id).FirstOrDefault();
                    if (removeClassRoom is not null)
                    {
                        var lessons = dbContext.Lessons.Where(x => x.FirstClassRoomId == id || x.SecondClassRoomId == id).ToList();
                        dbContext.Lessons.RemoveRange(lessons);
                        dbContext.ClassRooms.Remove(removeClassRoom);
                        dbContext.SaveChanges();
                    }
                }
                else if (requestData["type"].ToString() == "create")
                {
                    var name = requestData["room"]["Name"].ToString();
                    var description = requestData["room"]?["Description"]?.ToString();
                    var creatingSubject = new ClassRoom { Name = name, Description = description };
                    dbContext.ClassRooms.Add(creatingSubject);
                    dbContext.SaveChanges();
                }
            }
        }

        public async Task SchedulesRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {

        }

        public async Task GeneralRequestInvoke(HttpContext context, DatabaseContext dbContext)
        {
            using (var reader = new StreamReader(context.Request.Body))
            {
                var requestBody = await reader.ReadToEndAsync();
                var requestData = JObject.Parse(requestBody);
                if (requestData["type"].ToString() == "getGeneralSettings")
                {
                    var generalSettings = dbContext.GeneralSettings.First();
                    var responseData = JsonConvert.SerializeObject(generalSettings);
                    await context.Response.WriteAsync(responseData);
                }
                else if (requestData["type"].ToString() == "setFirstSection")
                {
                    var name = requestData["name"].ToString();
                    var description = requestData["description"].ToString();
                    var generalSettings = dbContext.GeneralSettings.First();
                    generalSettings.SchedulesTitle = name;
                    generalSettings.SchedulesDescription = description;
                    dbContext.GeneralSettings.Update(generalSettings);
                    dbContext.SaveChanges();
                }
                else if (requestData["type"].ToString() == "setSecondSection")
                {
                    var lessons = requestData["lessons"].ToString();
                    var parity = requestData["parity"].ToString();
                    var generalSettings = dbContext.GeneralSettings.First();
                    generalSettings.SchedulesLessons = lessons;
                    generalSettings.ShedulesParity = parity;
                    dbContext.GeneralSettings.Update(generalSettings);
                    dbContext.SaveChanges();
                }
                else if (requestData["type"].ToString() == "getAllSchedules")
                {
                    var schedules = dbContext.Schedules.ToList();
                    foreach (var schedule in schedules)
                    {
                        var lessons = dbContext.Lessons.Where(x => x.ScheduleId == schedule.Id).ToList();
                        foreach (var lesson in lessons)
                        {
                            if (lesson.FirstSubjectId is not null)
                                lesson.FirstSubject = dbContext.Subjects.Where(x => x.Id == lesson.FirstSubjectId).FirstOrDefault();
                            if (lesson.SecondSubjectId is not null)
                                lesson.SecondSubject = dbContext.Subjects.Where(x => x.Id == lesson.SecondSubjectId).FirstOrDefault();
                            if (lesson.FirstClassRoomId is not null)
                                lesson.FirstClassRoom = dbContext.ClassRooms.Where(x => x.Id == lesson.FirstClassRoomId).FirstOrDefault();
                            if (lesson.SecondClassRoomId is not null)
                                lesson.SecondClassRoom = dbContext.ClassRooms.Where(x => x.Id == lesson.SecondClassRoomId).FirstOrDefault();
                        }
                        schedule.Lessons = lessons;
                    }
                    var responseData = JsonConvert.SerializeObject(schedules);
                    await context.Response.WriteAsync(responseData);
                }
                else if (requestData["type"].ToString() == "deleteSchedule")
                {
                    var schelduleId = Convert.ToInt32(requestData["id"].ToString());
                    dbContext.Schedules.RemoveRange(dbContext.Schedules.Where(x => x.Id == schelduleId));
                    dbContext.Lessons.RemoveRange(dbContext.Lessons.Where(x => x.ScheduleId == schelduleId));
                    dbContext.SaveChanges();
                }
                else if (requestData["type"].ToString() == "createSchedule")
                {
                    var name = requestData["scheldule"]["name"].ToString();
                    var group = requestData["scheldule"]["group"].ToString();
                    var duration = requestData["scheldule"]?["duration"]?.ToString();
                    var message = requestData["scheldule"]?["message"]?.ToString();
                    var createdScheldule = new Schedule { Name = name, Group = group, Duration = duration, Message = message };
                    dbContext.Schedules.Add(createdScheldule);
                    dbContext.SaveChanges();
                }
                else if (requestData["type"].ToString() == "updateScheldule")
                {
                    var id = Convert.ToInt32(requestData["scheldule"]["id"].ToString());
                    var name = requestData["scheldule"]["name"].ToString();
                    var group = requestData["scheldule"]["group"].ToString();
                    var duration = requestData["scheldule"]?["duration"]?.ToString();
                    var message = requestData["scheldule"]?["message"]?.ToString();

                    var updatedScheldule = dbContext.Schedules.Where(x => x.Id == id).First();
                    updatedScheldule.Duration = duration;
                    updatedScheldule.Message = message;
                    updatedScheldule.Group = group;
                    updatedScheldule.Name = name;

                    dbContext.Schedules.Update(updatedScheldule);
                    dbContext.SaveChanges();
                }
                else if (requestData["type"].ToString() == "updateLesson")
                {
                    var scheduleId = Convert.ToInt32(requestData["scheduleId"].ToString());
                    var day = (Day)Convert.ToInt32(requestData["day"].ToString());
                    var lessonNumber = Convert.ToInt32(requestData["lessonNumber"].ToString());
                    // delete exist lessons from database
                    dbContext.Lessons.RemoveRange(dbContext.Lessons.Where(x => x.Day == day && x.Number == lessonNumber && x.ScheduleId == scheduleId));
                    dbContext.SaveChanges();

                    Lesson lesson = new Lesson();
                    lesson.FirstSubjectId = Convert.ToInt32(requestData["lesson"]?["FirstSubjectId"]?.ToString());
                    lesson.FirstClassRoomId = Convert.ToInt32(requestData["lesson"]?["FirstClassRoom"]?["Id"]?.ToString());
                    lesson.FirstLessonType = requestData["lesson"]?["FirstLessonType"]?.ToString();
                    lesson.FirstLessonLink = requestData["lesson"]?["FirstLessonLink"]?.ToString();
                    try
                    {
                        lesson.SecondSubjectId = Convert.ToInt32(requestData["lesson"]?["SecondClassRoomId"]?.ToString());
                        lesson.SecondClassRoomId = Convert.ToInt32(requestData["lesson"]?["SecondClassRoom"]?["Id"]?.ToString());
                        lesson.SecondLessonType = requestData["lesson"]?["SecondLessonType"]?.ToString();
                        lesson.SecondLessonLink = requestData["lesson"]?["SecondLessonLink"]?.ToString();
                    } catch { }

                    lesson.Day = day;
                    lesson.Number = lessonNumber;
                    lesson.ScheduleId = scheduleId;
                    if( lesson.FirstSubjectId != null )
                        dbContext.Lessons.Add(lesson);
                    dbContext.SaveChanges();
                }
            }
        }
    }
}
