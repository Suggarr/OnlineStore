using Microsoft.EntityFrameworkCore;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Data;

namespace OnlineStore.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _context;

    public CartRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CartItem>> GetAllAsync()
    {
        return await _context.CartItems.ToListAsync();
    }

    public async Task<CartItem?> GetByIdAsync(Guid id)
    {
        return await _context.CartItems.FindAsync(id);
    }

    public async Task AddAsync(CartItem item)
    {
        await _context.CartItems.AddAsync(item);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateQuantityAsync(Guid id, int quantity)
    {
        var item = await _context.CartItems.FindAsync(id);
        if (item is not null)
        {
            item.Quantity = quantity;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var item = await _context.CartItems.FindAsync(id);
        if (item is not null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearAsync()
    {
        _context.CartItems.RemoveRange(_context.CartItems);
        await _context.SaveChangesAsync();
    }
}
