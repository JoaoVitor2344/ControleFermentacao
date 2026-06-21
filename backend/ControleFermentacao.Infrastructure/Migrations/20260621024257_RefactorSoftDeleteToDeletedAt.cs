using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleFermentacao.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorSoftDeleteToDeletedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Tanks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Beers",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Tanks");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Beers");
        }
    }
}
