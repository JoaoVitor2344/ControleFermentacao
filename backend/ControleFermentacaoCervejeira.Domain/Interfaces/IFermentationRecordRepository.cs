using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Enums;

namespace ControleFermentacaoCervejeira.Domain.Interfaces;

public interface IFermentationRecordRepository
{
    Task AddAsync(FermentationRecord record);
    Task<FermentationRecord?> GetByIdAsync(Guid id);
    Task UpdateAsync(FermentationRecord record);
    Task<Dictionary<FermentationStatus, int>> GetSummaryAsync();
    Task<IEnumerable<FermentationRecord>> GetByBatchNumberAsync(string batchNumber);
    Task<IEnumerable<string>> GetAllBatchNumbersAsync();
    Task<(IEnumerable<FermentationRecord> Items, int TotalCount)> GetAllPagedAsync(
        int page, int pageSize,
        Guid? beerId = null, Guid? tankId = null, string? batchNumber = null,
        FermentationStatus? status = null, bool ascending = false);
}
