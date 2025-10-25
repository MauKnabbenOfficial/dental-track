using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace DentalTrack.Infrastructure.DB
{
    //public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DbContext>
    //{
    //    //public DbContext CreateDbContext(string[] args)
    //    //{
    //    //    var config = new ConfigurationBuilder()
    //    //        .AddJsonFile("appsettings.Development.json", optional: true)
    //    //        .AddEnvironmentVariables()
    //    //        .Build();

    //    //    var teste = IConfigurationBuilder
    //    //        .AddJsonFile("appsettings.json", optional: true)
    //    //        .AddEnvironmentVariables()
    //    //        .Build();

    //    //    var conn = config.GetConnectionString("DentalTrackDb")
    //    //               ?? Environment.GetEnvironmentVariable("DENTALTRACK_CONN");

    //    //    var options = new DbContextOptionsBuilder<DbContext>()
    //    //        .UseSqlServer(conn).Options;

    //    //    return new DbContext(options);
    //    //}
    //}
}
