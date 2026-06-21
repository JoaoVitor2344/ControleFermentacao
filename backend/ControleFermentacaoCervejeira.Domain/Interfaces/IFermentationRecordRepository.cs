using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Enums;

namespace ControleFermentacaoCervejeira.Domain.Interfaces;

public interface IFermentationRecordRepository
{
    Task AddAsync(FermentationRecord record);
    Task<Dictionary<FermentationStatus, int>> GetSummaryAsync();
    Task<IEnumerable<FermentationRecord>> GetByBatchNumberAsync(string batchNumber);
}