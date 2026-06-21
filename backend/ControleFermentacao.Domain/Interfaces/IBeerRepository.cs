using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface IBeerRepository
{
    Task<Beer?> GetByIdAsync(Guid id);
    Task AddAsync(Beer beer);
    Task<IEnumerable<Beer>> GetAllAsync();
    Task UpdateAsync(Beer beer);
    Task DeleteAsync(Guid id);
}