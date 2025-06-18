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
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                throw new Exception("User ID claim not found");

            return Guid.Parse(userIdClaim);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            var userId = GetUserId();
            await _orderService.CreateOrderAsync(userId);
            var orders = await _orderService.GetOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var userId = GetUserId();
            var orders = await _orderService.GetOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)
        {
            var userId = GetUserId();
            var order = await _orderService.GetOrderByIdAsync(id, userId);
            if (order == null)
                return NotFound();

            return Ok(order);
        }
    }
}
