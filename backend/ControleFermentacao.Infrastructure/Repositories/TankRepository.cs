using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using ControleFermentacao.Infrastructure.Data.Context;

namespace ControleFermentacao.Infrastructure.Repositories;

public class TankRepository : ITankRepository
{
    private readonly AppDbContext _context;

    public TankRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Tank?> GetByIdAsync(Guid id)
    {
        return await _context.Tanks.FindAsync(id);
    }
}