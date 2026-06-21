using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Enums;
using ControleFermentacao.Domain.Interfaces;
using ControleFermentacao.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

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

    public async Task<Dictionary<FermentationStatus, int>> GetSummaryAsync()
    {
        return await _context.FermentationRecords
            .GroupBy(f => f.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
}