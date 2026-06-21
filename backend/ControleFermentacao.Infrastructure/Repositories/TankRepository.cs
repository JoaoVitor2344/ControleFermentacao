using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using ControleFermentacao.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

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

    public async Task AddAsync(Tank tank)
    {
        await _context.Tanks.AddAsync(tank);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Tank>> GetAllAsync(bool includeDeleted = false)
    {
        // IgnoreQueryFilters() desativa o filtro global de soft delete do DbContext,
        // retornando todos os registros incluindo os logicamente excluídos
        var query = includeDeleted
            ? _context.Tanks.IgnoreQueryFilters()
            : _context.Tanks.AsQueryable();

        return await query.ToListAsync();
    }

    public async Task UpdateAsync(Tank tank)
    {
        _context.Tanks.Update(tank);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var tank = await _context.Tanks.FindAsync(id);
        if (tank != null)
        {
            tank.Delete();
            _context.Tanks.Update(tank);
            await _context.SaveChangesAsync();
        }
    }
}