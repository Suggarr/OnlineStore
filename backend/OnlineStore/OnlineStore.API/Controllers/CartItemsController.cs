using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using System.Security.Claims;

namespace OnlineStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartItemsController : ControllerBase
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartItemsController(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
            throw new Exception("User ID claim not found");

        return Guid.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItemDto>>> GetAll()
    {
        var userId = GetUserId();
        var items = await _cartRepository.GetAllForUserAsync(userId);

        var result = items.Select(item => new CartItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product.Name,
            Price = item.Product.Price,
            ImageUrl = item.Product.ImageUrl,
            Quantity = item.Quantity
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(CreateCartItemDto dto)
    {
        var userId = GetUserId();
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product is null)
            return NotFound("Продукт не найден");

        var cartItem = new CartItem
        {
            ProductId = product.Id,
            Quantity = dto.Quantity,
            UserId = userId
        };

        await _cartRepository.AddAsync(cartItem);
        return Ok();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CartItemDto>> GetById(Guid id)
    {
        var userId = GetUserId();
        var item = await _cartRepository.GetByIdAsync(id, userId);
        if (item is null)
            return NotFound();

        var dto = new CartItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product.Name,
            Price = item.Product.Price,
            ImageUrl = item.Product.ImageUrl,
            Quantity = item.Quantity
        };

        return Ok(dto);
    }

    [HttpPut("{id:guid}/quantity")]
    public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemQuantityDto dto)
    {
        var userId = GetUserId();
        await _cartRepository.UpdateQuantityAsync(id, dto.Quantity, userId);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        await _cartRepository.DeleteAsync(id, userId);
        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> Clear()
    {
        var userId = GetUserId();
        await _cartRepository.ClearAsync(userId);
        return NoContent();
    }
}
