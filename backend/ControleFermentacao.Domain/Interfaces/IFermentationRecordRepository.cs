using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Enums;

namespace ControleFermentacao.Domain.Interfaces;

public interface IFermentationRecordRepository
{
    Task AddAsync(FermentationRecord record);
    Task<Dictionary<FermentationStatus, int>> GetSummaryAsync();
    Task<IEnumerable<FermentationRecord>> GetByBatchNumberAsync(string batchNumber);
}