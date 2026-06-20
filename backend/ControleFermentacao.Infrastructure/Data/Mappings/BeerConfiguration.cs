using ControleFermentacao.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleFermentacao.Infrastructure.Data.Mappings;

public class BeerConfiguration : IEntityTypeConfiguration<Beer>
{
    public void Configure(EntityTypeBuilder<Beer> builder)
    {
        builder.ToTable("Beers");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(b => b.Style)
            .IsRequired()
            .HasMaxLength(50);

        // 5 dígitos no total, 2 após a vírgula
        builder.Property(b => b.MinTemperature).HasPrecision(5, 2);
        builder.Property(b => b.MaxTemperature).HasPrecision(5, 2);

        builder.Property(b => b.MinPh).HasPrecision(4, 2);
        builder.Property(b => b.MaxPh).HasPrecision(4, 2);

        builder.Property(b => b.MinExtract).HasPrecision(5, 2);
        builder.Property(b => b.MaxExtract).HasPrecision(5, 2);
    }
}