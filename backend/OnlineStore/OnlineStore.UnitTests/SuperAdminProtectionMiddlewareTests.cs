using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using OnlineStore.API.Middlewares;
using Xunit;

namespace OnlineStore.UnitTests
{
    public class SuperAdminProtectionMiddlewareTests
    {
        [Fact]
        public async Task InvokeAsync_Returns403_WhenSuperAdminDeletesSelf()
        {
            var userId = Guid.NewGuid();

            var loggerMock = new Mock<ILogger<SuperAdminProtectionMiddleware>>();
            var middleware = new SuperAdminProtectionMiddleware(async (innerHttpContext) =>
            {
                await innerHttpContext.Response.WriteAsync("next-called");
            }, loggerMock.Object);

            var context = new DefaultHttpContext();
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()), new Claim(ClaimTypes.Role, "SuperAdmin") };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test"));

            context.Request.RouteValues["controller"] = "Users";
            context.Request.RouteValues["action"] = "Delete";
            context.Request.RouteValues["id"] = userId.ToString();
            context.Request.Method = HttpMethods.Delete;

            var bodyStream = new MemoryStream();
            context.Response.Body = bodyStream;

            await middleware.InvokeAsync(context);

            Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);

            bodyStream.Seek(0, SeekOrigin.Begin);
            var reader = new StreamReader(bodyStream, Encoding.UTF8);
            var responseText = await reader.ReadToEndAsync();
            Assert.Contains("Нельзя удалить самого себя", responseText);
        }

        [Fact]
        public async Task InvokeAsync_CallsNext_WhenNotBlocked()
        {
            var userId = Guid.NewGuid();

            var called = false;
            var loggerMock = new Mock<ILogger<SuperAdminProtectionMiddleware>>();
            var middleware = new SuperAdminProtectionMiddleware(async (innerHttpContext) =>
            {
                called = true;
                await innerHttpContext.Response.WriteAsync("next-called");
            }, loggerMock.Object);

            var context = new DefaultHttpContext();
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()), new Claim(ClaimTypes.Role, "SuperAdmin") };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test"));

            context.Request.RouteValues["controller"] = "Products";
            context.Request.RouteValues["action"] = "Delete";
            context.Request.RouteValues["id"] = Guid.NewGuid().ToString();
            context.Request.Method = HttpMethods.Delete;

            var bodyStream = new MemoryStream();
            context.Response.Body = bodyStream;

            await middleware.InvokeAsync(context);

            Assert.True(called);
            bodyStream.Seek(0, SeekOrigin.Begin);
            var reader = new StreamReader(bodyStream, Encoding.UTF8);
            var responseText = await reader.ReadToEndAsync();
            Assert.Contains("next-called", responseText);
        }
    }
}
