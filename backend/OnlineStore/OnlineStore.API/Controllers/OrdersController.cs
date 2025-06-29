﻿using Microsoft.AspNetCore.Authorization;
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
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                _logger.LogWarning("User ID claim not found in token.");
                throw new Exception("User ID claim not found");
            }
            return Guid.Parse(userIdClaim);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            var userId = GetUserId();
            _logger.LogInformation("Пользователь {UserId} создает заказ", userId);

            try
            {
                await _orderService.CreateOrderAsync(userId);
                var orders = await _orderService.GetOrdersAsync(userId);
                _logger.LogInformation($"Заказ успешно создан для пользователя {userId}");
                return Ok(orders);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Не удалось создать заказ для пользователя {userId}: {ex.Message}");
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var userId = GetUserId();
            _logger.LogInformation($"Пользователь {userId} запрашивает список заказов");

            var orders = await _orderService.GetOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)
        {
            var userId = GetUserId();
            _logger.LogInformation($"Пользователь {userId} запрашивает заказ с Id {id}");

            var order = await _orderService.GetOrderByIdAsync(id, userId);
            if (order == null)
            {
                _logger.LogWarning($"Заказ с Id {id} не найден для пользователя {userId}");
                return NotFound();
            }
            return Ok(order);
        }
    }
}
