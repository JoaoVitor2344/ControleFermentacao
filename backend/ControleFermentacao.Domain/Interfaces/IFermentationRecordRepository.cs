using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface IFermentationRecordRepository
{
    Task AddAsync(FermentationRecord record);
}