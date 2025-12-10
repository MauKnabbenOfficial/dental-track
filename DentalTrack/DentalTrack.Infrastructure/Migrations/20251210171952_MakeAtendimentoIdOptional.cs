using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeAtendimentoIdOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "AtendimentoId",
                table: "LancamentosFinanceiros",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 10, 17, 19, 51, 852, DateTimeKind.Utc).AddTicks(6937));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 10, 17, 19, 51, 852, DateTimeKind.Utc).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "DtCadastro",
                value: new DateTime(2025, 12, 10, 17, 19, 51, 852, DateTimeKind.Utc).AddTicks(6941));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "DtCadastro", "SenhaHash" },
                values: new object[] { new DateTime(2025, 12, 10, 17, 19, 51, 852, DateTimeKind.Utc).AddTicks(6970), "$2a$11$8exE8GCa34lMzsE29t5y9ujB5Yiz5qjaFOV2MMc.Sghvs/9K3/Qey" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "AtendimentoId",
                table: "LancamentosFinanceiros",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

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

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "DtCadastro", "SenhaHash" },
                values: new object[] { new DateTime(2025, 12, 6, 2, 45, 13, 455, DateTimeKind.Utc).AddTicks(8368), "$2a$11$8K1p/a0dR1xqM8K3hCKw4OyL3mZ8nR5tG9vX2sW6yU0iE7jF4gH1K" });
        }
    }
}
