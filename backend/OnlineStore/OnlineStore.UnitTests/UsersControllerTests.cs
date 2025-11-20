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
    public class UsersControllerTests
    {
        private static UsersController CreateController(Mock<IUserService> userService, Guid? userId = null, string? role = null)
        {
            var logger = Mock.Of<ILogger<UsersController>>();
            var controller = new UsersController(userService.Object, logger);
            var httpContext = new DefaultHttpContext();

            if (userId.HasValue || role != null)
            {
                var claims = new System.Collections.Generic.List<Claim>();
                if (userId.HasValue)
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
                if (role != null)
                    claims.Add(new Claim(ClaimTypes.Role, role));

                httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test"));
            }

            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
            return controller;
        }

        [Fact]
        public async Task GetById_ReturnsOk_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var mockService = new Mock<IUserService>();
            var expected = new UserDto { Id = userId, Username = "u", Email = "e" };
            mockService.Setup(s => s.GetByIdAsync(userId)).ReturnsAsync(expected);

            var controller = CreateController(mockService);

            // Act
            var result = await controller.GetById(userId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<UserDto>>(result);
            var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expected, ok.Value);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var mockService = new Mock<IUserService>();
            mockService.Setup(s => s.GetByIdAsync(userId)).ReturnsAsync((UserDto?)null);

            var controller = CreateController(mockService);

            // Act
            var result = await controller.GetById(userId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<UserDto>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task Update_ReturnsUnauthorized_WhenUserIdMissing()
        {
            // Arrange
            var mockService = new Mock<IUserService>();
            var controller = CreateController(mockService); // no user id claim

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            var dto = new UpdateUserDto { Email = "a@b.com", Username = "name" };

            // Act
            var result = await controller.Update(dto);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}
