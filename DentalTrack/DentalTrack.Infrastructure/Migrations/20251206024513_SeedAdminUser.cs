using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 45, 13, 455, DateTimeKind.Utc).AddTicks(8334));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 45, 13, 455, DateTimeKind.Utc).AddTicks(8337));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 45, 13, 455, DateTimeKind.Utc).AddTicks(8337));

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "Avatar", "DtCadastro", "Email", "EmailConfirmado", "Especialidade", "Nome", "PerfilId", "SenhaHash" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), true, null, new DateTime(2025, 12, 6, 2, 45, 13, 455, DateTimeKind.Utc).AddTicks(8368), "admin@dentaltrack.com", true, null, "Administrador", new Guid("11111111-1111-1111-1111-111111111111"), "$2a$11$8exE8GCa34lMzsE29t5y9ujB5Yiz5qjaFOV2MMc.Sghvs/9K3/Qey" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 37, 59, 228, DateTimeKind.Utc).AddTicks(8938));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 37, 59, 228, DateTimeKind.Utc).AddTicks(8943));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 6, 2, 37, 59, 228, DateTimeKind.Utc).AddTicks(8943));
        }
    }
}
