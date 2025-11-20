using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using OnlineStore.API.Controllers;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using Xunit;

namespace OnlineStore.UnitTests
{
    public class OrdersControllerTests
    {
        [Fact]
        public async Task CreateOrder_ReturnsBadRequest_WhenServiceThrowsInvalidOperation()
        {
            var userId = Guid.NewGuid();
            var mockService = new Mock<IOrderService>();
            mockService.Setup(s => s.CreateOrderAsync(userId)).ThrowsAsync(new InvalidOperationException("bad"));

            var logger = Mock.Of<ILogger<OrdersController>>();
            var controller = new OrdersController(mockService.Object, logger);
            controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }, "test")) } };

            var result = await controller.CreateOrder();

            Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public async Task GetOrderById_ReturnsNotFound_WhenOrderMissing()
        {
            var userId = Guid.NewGuid();
            var orderId = Guid.NewGuid();
            var mockService = new Mock<IOrderService>();
            mockService.Setup(s => s.GetOrderByIdAsync(orderId, userId)).ReturnsAsync((OrderDto?)null);

            var logger = Mock.Of<ILogger<OrdersController>>();
            var controller = new OrdersController(mockService.Object, logger);
            controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }, "test")) } };

            var result = await controller.GetOrderById(orderId);

            var action = Assert.IsType<ActionResult<OrderDto>>(result);
            Assert.IsType<NotFoundResult>(action.Result);
        }
    }
}
