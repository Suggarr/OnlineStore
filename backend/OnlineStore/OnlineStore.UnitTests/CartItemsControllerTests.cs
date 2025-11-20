using System;
using System.Collections.Generic;
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
    // ѕростые, пон€тные тесты в стиле junior: кажда€ проверка небольша€ и фокусируетс€ на одном сценарии.
    public class CartItemsControllerTests
    {
        private static CartItemsController CreateController(Mock<ICartService> cartService, Guid? userId = null)
        {
            var logger = Mock.Of<ILogger<CartItemsController>>();
            var controller = new CartItemsController(cartService.Object, logger);
            var httpContext = new DefaultHttpContext();

            if (userId.HasValue)
            {
                var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()) };
                httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test"));
            }

            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
            return controller;
        }

        [Fact]
        public async Task GetAll_ReturnsOk_WithItems()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var expectedItems = new List<CartItemDto>
            {
                new CartItemDto { Id = Guid.NewGuid(), ProductId = Guid.NewGuid(), Quantity = 1 }
            };

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.GetAllAsync(It.IsAny<Guid>())).ReturnsAsync(expectedItems);

            var controller = CreateController(mockService, userId);

            // Act
            var actionResult = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var actual = Assert.IsAssignableFrom<IEnumerable<CartItemDto>>(okResult.Value);
            Assert.Equal(expectedItems, actual);

            // verify service called with correct userId
            mockService.Verify(s => s.GetAllAsync(It.Is<Guid>(g => g == userId)), Times.Once);
        }

        [Fact]
        public async Task AddToCart_ReturnsNotFound_WhenProductMissing()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.AddToCartAsync(It.IsAny<Guid>(), It.IsAny<CreateCartItemDto>())).ReturnsAsync(false);

            var controller = CreateController(mockService, userId);
            var dto = new CreateCartItemDto { ProductId = Guid.NewGuid(), Quantity = 1 };

            // Act
            var result = await controller.AddToCart(dto);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            var message = Assert.IsType<string>(notFound.Value);
            Assert.Contains(dto.ProductId.ToString(), message);

            mockService.Verify(s => s.AddToCartAsync(It.Is<Guid>(g => g == userId), It.IsAny<CreateCartItemDto>()), Times.Once);
        }

        [Fact]
        public async Task AddToCart_ReturnsOk_WhenAdded()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.AddToCartAsync(It.IsAny<Guid>(), It.IsAny<CreateCartItemDto>())).ReturnsAsync(true);

            var controller = CreateController(mockService, userId);
            var dto = new CreateCartItemDto { ProductId = Guid.NewGuid(), Quantity = 2 };

            // Act
            var result = await controller.AddToCart(dto);

            // Assert
            Assert.IsType<OkResult>(result);
            mockService.Verify(s => s.AddToCartAsync(It.Is<Guid>(g => g == userId), It.Is<CreateCartItemDto>(d => d.ProductId == dto.ProductId && d.Quantity == dto.Quantity)), Times.Once);
        }

        [Fact]
        public async Task GetById_ReturnsOk_WhenFound()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var itemId = Guid.NewGuid();
            var expected = new CartItemDto { Id = itemId, ProductId = Guid.NewGuid(), Quantity = 3 };

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.GetByIdAsync(itemId, It.IsAny<Guid>())).ReturnsAsync(expected);

            var controller = CreateController(mockService, userId);

            // Act
            var action = await controller.GetById(itemId);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(action.Result);
            var actual = Assert.IsType<CartItemDto>(ok.Value);
            Assert.Equal(expected.Id, actual.Id);
            mockService.Verify(s => s.GetByIdAsync(itemId, It.Is<Guid>(g => g == userId)), Times.Once);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenMissing()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var itemId = Guid.NewGuid();

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.GetByIdAsync(itemId, It.IsAny<Guid>())).ReturnsAsync((CartItemDto?)null);

            var controller = CreateController(mockService, userId);

            // Act
            var action = await controller.GetById(itemId);

            // Assert
            Assert.IsType<NotFoundResult>(action.Result);
            mockService.Verify(s => s.GetByIdAsync(itemId, It.Is<Guid>(g => g == userId)), Times.Once);
        }

        [Fact]
        public async Task IsInCart_ReturnsOk_WithBool()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var productId = Guid.NewGuid();

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.IsProductInCartAsync(It.IsAny<Guid>(), It.IsAny<Guid>())).ReturnsAsync(true);

            var controller = CreateController(mockService, userId);

            // Act
            var action = await controller.IsInCart(productId);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(action.Result);
            Assert.True((bool)ok.Value!);
            mockService.Verify(s => s.IsProductInCartAsync(It.Is<Guid>(g => g == userId), It.Is<Guid>(p => p == productId)), Times.Once);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenDeleted()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var itemId = Guid.NewGuid();

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.DeleteAsync(itemId, It.IsAny<Guid>())).ReturnsAsync(true);

            var controller = CreateController(mockService, userId);

            // Act
            var result = await controller.Delete(itemId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            mockService.Verify(s => s.DeleteAsync(itemId, It.Is<Guid>(g => g == userId)), Times.Once);
        }

        [Fact]
        public async Task Clear_ReturnsNoContent()
        {
            // Arrange
            var userId = Guid.NewGuid();

            var mockService = new Mock<ICartService>();
            mockService.Setup(s => s.ClearAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);

            var controller = CreateController(mockService, userId);

            // Act
            var result = await controller.Clear();

            // Assert
            Assert.IsType<NoContentResult>(result);
            mockService.Verify(s => s.ClearAsync(It.Is<Guid>(g => g == userId)), Times.Once);
        }
    }
}
