using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Repositories;

namespace OnlineStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartItemsController : ControllerBase
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartItemsController(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItemDto>>> GetAll()
    {
        var items = await _cartRepository.GetAllAsync();

        var result = items.Select(item => new CartItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Price = item.Price,
            Quantity = item.Quantity,
            ImageUrl = item.ImageUrl
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(CreateCartItemDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product is null)
            return NotFound("Продукт не найден");

        var cartItem = new CartItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = dto.Quantity,
            ImageUrl = product.ImageUrl
        };

        await _cartRepository.AddAsync(cartItem);

        return Ok();
    }


    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CartItemDto>> GetById(Guid id)
    {
        var item = await _cartRepository.GetByIdAsync(id);
        if (item is null)
            return NotFound();

        var dto = new CartItemDto
        {
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Price = item.Price,
            Quantity = item.Quantity,
            ImageUrl = item.ImageUrl
        };

        return Ok(dto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _cartRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("{id:guid}/quantity")]
    public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemQuantityDto dto)
    {
        await _cartRepository.UpdateQuantityAsync(id, dto.Quantity);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        await _cartRepository.ClearAsync();
        return NoContent();
    }
}
