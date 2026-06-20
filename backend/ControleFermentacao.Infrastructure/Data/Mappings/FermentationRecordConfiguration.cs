using ControleFermentacao.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleFermentacao.Infrastructure.Data.Mappings;

public class FermentationRecordConfiguration : IEntityTypeConfiguration<FermentationRecord>
{
    public void Configure(EntityTypeBuilder<FermentationRecord> builder)
    {
        builder.ToTable("FermentationRecords");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.BatchNumber)
            .IsRequired()
            .HasMaxLength(50);
        builder.Property(f => f.Notes)
            .HasMaxLength(500);
        builder.Property(f => f.Status)
            .IsRequired();
        builder.HasOne<Beer>()
            .WithMany()
            .HasForeignKey(f => f.BeerId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Tank>()
            .WithMany()
            .HasForeignKey(f => f.TankId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}