using ControleFermentacaoCervejeira.Domain.Entities;

namespace ControleFermentacaoCervejeira.Domain.Interfaces;

public interface IBeerRepository
{
    Task<Beer?> GetByIdAsync(Guid id);
    Task AddAsync(Beer beer);
    // includeDeleted: quando true, retorna também registros com soft delete aplicado
    Task<IEnumerable<Beer>> GetAllAsync(bool includeDeleted = false, string? name = null, string? style = null);
    Task UpdateAsync(Beer beer);
    Task DeleteAsync(Guid id);
}
