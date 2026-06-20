using ControleFermentacao.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleFermentacao.Infrastructure.Data.Mappings;

public class TankConfiguration : IEntityTypeConfiguration<Tank>
{
    public void Configure(EntityTypeBuilder<Tank> builder)
    {
        builder.ToTable("Tanks");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(t => t.CapacityLiters)
            .IsRequired()
            .HasPrecision(10, 2);
    }
}