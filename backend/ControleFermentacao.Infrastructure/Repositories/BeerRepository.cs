using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using ControleFermentacao.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace ControleFermentacao.Infrastructure.Repositories;

public class BeerRepository : IBeerRepository
{
    private readonly AppDbContext _context;

    public BeerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Beer?> GetByIdAsync(Guid id)
    {
        return await _context.Beers.FindAsync(id);
    }

    public async Task AddAsync(Beer beer)
    {
        await _context.Beers.AddAsync(beer);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Beer>> GetAllAsync()
    {
        return await _context.Beers.ToListAsync();
    }

    public async Task UpdateAsync(Beer beer)
    {
        _context.Beers.Update(beer);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var beer = await _context.Beers.FindAsync(id);
        if (beer != null)
        {
            beer.Delete();
            _context.Beers.Update(beer);
            await _context.SaveChangesAsync();
        }
    }
}