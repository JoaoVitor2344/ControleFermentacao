using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using ControleFermentacaoCervejeira.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace ControleFermentacaoCervejeira.Infrastructure.Repositories;

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

    public async Task<IEnumerable<Tank>> GetAllAsync(
        bool includeDeleted = false,
        string? name = null,
        decimal? minCapacityLiters = null,
        decimal? maxCapacityLiters = null)
    {
        // IgnoreQueryFilters() desativa o filtro global de soft delete do DbContext,
        // retornando todos os registros incluindo os logicamente excluídos
        var query = includeDeleted
            ? _context.Tanks.IgnoreQueryFilters()
            : _context.Tanks.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(tank => EF.Functions.ILike(tank.Name, $"%{name.Trim()}%"));

        if (minCapacityLiters.HasValue)
            query = query.Where(tank => tank.CapacityLiters >= minCapacityLiters.Value);

        if (maxCapacityLiters.HasValue)
            query = query.Where(tank => tank.CapacityLiters <= maxCapacityLiters.Value);

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
