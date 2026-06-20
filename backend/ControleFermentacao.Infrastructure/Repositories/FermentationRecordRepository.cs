using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using ControleFermentacao.Infrastructure.Data.Context;

namespace ControleFermentacao.Infrastructure.Repositories;

public class FermentationRecordRepository : IFermentationRecordRepository
{
    private readonly AppDbContext _context;

    public FermentationRecordRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(FermentationRecord record)
    {
        await _context.FermentationRecords.AddAsync(record);
        await _context.SaveChangesAsync();
    }
}