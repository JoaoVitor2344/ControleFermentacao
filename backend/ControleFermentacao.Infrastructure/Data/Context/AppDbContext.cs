using ControleFermentacao.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ControleFermentacao.Infrastructure.Data.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Beer> Beers { get; set; } = null!;
    public DbSet<Tank> Tanks { get; set; } = null!;
    public DbSet<FermentationRecord> FermentationRecords { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ela percorre o nosso projeto Infrastructure e aplica 
        // todas as classes que herdam de IEntityTypeConfiguration
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}