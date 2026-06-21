using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface ITankRepository
{
    Task<Tank?> GetByIdAsync(Guid id);
    Task AddAsync(Tank tank);
    Task<IEnumerable<Tank>> GetAllAsync();
    Task UpdateAsync(Tank tank);
    Task DeleteAsync(Guid id);
}