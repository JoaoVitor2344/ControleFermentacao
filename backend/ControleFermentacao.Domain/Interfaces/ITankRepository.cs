using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface ITankRepository
{
    Task<Tank?> GetByIdAsync(Guid id);
    Task AddAsync(Tank tank);
    // includeDeleted: quando true, retorna também registros com soft delete aplicado
    Task<IEnumerable<Tank>> GetAllAsync(bool includeDeleted = false);
    Task UpdateAsync(Tank tank);
    Task DeleteAsync(Guid id);
}