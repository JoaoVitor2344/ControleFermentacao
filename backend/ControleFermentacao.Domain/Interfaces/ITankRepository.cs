using ControleFermentacao.Domain.Entities;

namespace ControleFermentacao.Domain.Interfaces;

public interface ITankRepository
{
    Task<Tank?> GetByIdAsync(Guid id);
    Task AddAsync(Tank tank);
}