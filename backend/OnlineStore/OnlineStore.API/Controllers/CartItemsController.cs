using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using System.Security.Claims;

namespace OnlineStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartItemsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartItemsController(ICartService cartService)
        {
            _cartService = cartService;
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
            var items = await _cartService.GetAllAsync(userId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(CreateCartItemDto dto)
        {
            var userId = GetUserId();
            var added = await _cartService.AddToCartAsync(userId, dto);
            if (!added)
                return NotFound("Product not found");

            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CartItemDto>> GetById(Guid id)
        {
            var userId = GetUserId();
            var item = await _cartService.GetByIdAsync(id, userId);
            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPut("{id:guid}/quantity")]
        public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemQuantityDto dto)
        {
            var userId = GetUserId();
            var updated = await _cartService.UpdateQuantityAsync(id, dto.Quantity, userId);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            var deleted = await _cartService.DeleteAsync(id, userId);
            if (!deleted)
                return NotFound();

            return NoContent();//Изменю потом NoContent() на Ok(),чтобы вернуть хотя что-то
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();
            await _cartService.ClearAsync(userId);
            return NoContent();
        }
    }
}
