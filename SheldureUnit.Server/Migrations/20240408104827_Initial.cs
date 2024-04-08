using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SheldureUnit.Server.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ClassRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassRooms", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Group = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Duration = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SubjectName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubjectDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Login = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Day = table.Column<int>(type: "int", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false),
                    FirstSubjectId = table.Column<int>(type: "int", nullable: true),
                    FirstClassRoomId = table.Column<int>(type: "int", nullable: true),
                    FirstLessonType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SecondSubjectId = table.Column<int>(type: "int", nullable: true),
                    SecondClassRoomId = table.Column<int>(type: "int", nullable: true),
                    SecondLessonType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ScheduleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_ClassRooms_FirstClassRoomId",
                        column: x => x.FirstClassRoomId,
                        principalTable: "ClassRooms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Lessons_ClassRooms_SecondClassRoomId",
                        column: x => x.SecondClassRoomId,
                        principalTable: "ClassRooms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Lessons_Schedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lessons_Subjects_FirstSubjectId",
                        column: x => x.FirstSubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Lessons_Subjects_SecondSubjectId",
                        column: x => x.SecondSubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "ClassRooms",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Description for Classroom 101", "Classroom 101" },
                    { 2, "Description for Classroom 102", "Classroom 102" },
                    { 3, "Description for Classroom 103", "Classroom 103" }
                });

            migrationBuilder.InsertData(
                table: "Schedules",
                columns: new[] { "Id", "Duration", "Group", "Name" },
                values: new object[] { 1, "1 hour", "Group A", "Schedule for Group A" });

            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "SubjectDescription", "SubjectName" },
                values: new object[,]
                {
                    { 1, "Description for Mathematics", "Mathematics" },
                    { 2, "Description for Science", "Science" },
                    { 3, "Description for History", "History" },
                    { 4, "Description for Literature", "Literature" }
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "Id", "Day", "FirstClassRoomId", "FirstLessonType", "FirstSubjectId", "Number", "ScheduleId", "SecondClassRoomId", "SecondLessonType", "SecondSubjectId" },
                values: new object[,]
                {
                    { 1, 0, 1, "Lecture", 1, 1, 1, null, null, null },
                    { 2, 0, 2, "Lab", 2, 2, 1, null, null, null },
                    { 3, 1, 3, "Lecture", 3, 1, 1, null, null, null },
                    { 4, 1, 1, "Lab", 4, 2, 1, null, null, null },
                    { 5, 2, 2, "Lab", 1, 1, 1, 3, "Lecture", 2 },
                    { 6, 2, 3, "Lecture", 3, 2, 1, 1, "Lab", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_FirstClassRoomId",
                table: "Lessons",
                column: "FirstClassRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_FirstSubjectId",
                table: "Lessons",
                column: "FirstSubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_ScheduleId",
                table: "Lessons",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SecondClassRoomId",
                table: "Lessons",
                column: "SecondClassRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SecondSubjectId",
                table: "Lessons",
                column: "SecondSubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "ClassRooms");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "Subjects");
        }
    }
}
