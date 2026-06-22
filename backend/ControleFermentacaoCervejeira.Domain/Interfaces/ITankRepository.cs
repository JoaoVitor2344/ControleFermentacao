using ControleFermentacaoCervejeira.Domain.Entities;

namespace ControleFermentacaoCervejeira.Domain.Interfaces;

public interface ITankRepository
{
    Task<Tank?> GetByIdAsync(Guid id);
    Task AddAsync(Tank tank);
    // includeDeleted: quando true, retorna também registros com soft delete aplicado
    Task<IEnumerable<Tank>> GetAllAsync(
        bool includeDeleted = false,
        string? name = null,
        decimal? minCapacityLiters = null,
        decimal? maxCapacityLiters = null);
    Task UpdateAsync(Tank tank);
    Task DeleteAsync(Guid id);
}
