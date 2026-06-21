using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface IBeerRepository
{
    Task<Beer?> GetByIdAsync(Guid id);
    Task AddAsync(Beer beer);
    // includeDeleted: quando true, retorna também registros com soft delete aplicado
    Task<IEnumerable<Beer>> GetAllAsync(bool includeDeleted = false);
    Task UpdateAsync(Beer beer);
    Task DeleteAsync(Guid id);
}