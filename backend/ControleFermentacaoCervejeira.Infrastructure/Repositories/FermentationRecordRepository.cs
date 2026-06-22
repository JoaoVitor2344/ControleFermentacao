using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Enums;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using ControleFermentacaoCervejeira.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace ControleFermentacaoCervejeira.Infrastructure.Repositories;

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

    public async Task<FermentationRecord?> GetByIdAsync(Guid id)
        => await _context.FermentationRecords.FindAsync(id);

    public async Task UpdateAsync(FermentationRecord record)
    {
        _context.FermentationRecords.Update(record);
        await _context.SaveChangesAsync();
    }

    public async Task<Dictionary<FermentationStatus, int>> GetSummaryAsync()
    {
        return await _context.FermentationRecords
            .GroupBy(f => f.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<IEnumerable<FermentationRecord>> GetByBatchNumberAsync(string batchNumber)
    {
        return await _context.FermentationRecords
            .Where(f => f.BatchNumber == batchNumber)
            .OrderBy(f => f.RecordedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllBatchNumbersAsync()
    {
        return await _context.FermentationRecords
            .GroupBy(f => f.BatchNumber)
            .Select(g => new
            {
                BatchNumber = g.Key,
                LatestRecordedAt = g.Max(x => x.RecordedAt)
            })
            .OrderByDescending(x => x.LatestRecordedAt)
            .Select(x => x.BatchNumber)
            .ToListAsync();
    }

    public async Task<(IEnumerable<FermentationRecord> Items, int TotalCount)> GetAllPagedAsync(
        int page, int pageSize,
        Guid? beerId = null, Guid? tankId = null, string? batchNumber = null,
        FermentationStatus? status = null, bool ascending = false)
    {
        var query = _context.FermentationRecords.AsQueryable();
        if (beerId.HasValue) query = query.Where(f => f.BeerId == beerId.Value);
        if (tankId.HasValue) query = query.Where(f => f.TankId == tankId.Value);
        if (!string.IsNullOrEmpty(batchNumber)) query = query.Where(f => f.BatchNumber == batchNumber);
        if (status.HasValue) query = query.Where(f => f.Status == status.Value);
        query = ascending
            ? query.OrderBy(f => f.RecordedAt)
            : query.OrderByDescending(f => f.RecordedAt);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, totalCount);
    }
}
