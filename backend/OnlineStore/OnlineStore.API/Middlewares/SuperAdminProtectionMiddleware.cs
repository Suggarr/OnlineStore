using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OnlineStore.Application.Interfaces;
using OnlineStore.Application.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlineStore.API.Middlewares
{
    public class SuperAdminProtectionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SuperAdminProtectionMiddleware> _logger;

        public SuperAdminProtectionMiddleware(RequestDelegate next, ILogger<SuperAdminProtectionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        
        //TODO: Сделать полегче if при trygetvalue
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true && context.User.IsInRole("SuperAdmin"))
            {
                Guid? currentUserId;
                try
                {
                    currentUserId = UserHelper.GetUserId(context.User, _logger);
                }
                catch (UnauthorizedAccessException ex)
                {
                    _logger.LogWarning(ex, "Ошибка при получении идентификатора пользователя.");
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync("Не удалось определить пользователя");
                    return;
                }

                var routeValues = context.Request.RouteValues;
                string? controller = null;
                string? action = null;

                if (routeValues.TryGetValue("controller", out var controllerObj))
                {
                    controller = controllerObj?.ToString();
                }
                if (routeValues.TryGetValue("action", out var actionObj))
                {
                    action = actionObj?.ToString();
                }

                if (routeValues.TryGetValue("id", out var idObj))
                {
                    string? idString = idObj?.ToString();
                    if (Guid.TryParse(idString, out var targetId) && currentUserId.HasValue)
                    {
                        // Нельзя SuperAdmin изменять свою собственную роль
                        if (context.Request.Method == HttpMethods.Patch &&
                            string.Equals(controller, "Users", StringComparison.OrdinalIgnoreCase) &&
                            string.Equals(action, "ChangeRole", StringComparison.OrdinalIgnoreCase) &&
                            targetId == currentUserId.Value)
                        {
                            _logger.LogWarning("SuperAdmin попытался изменить свою собственную роль");
                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            await context.Response.WriteAsJsonAsync("Нельзя изменять свою собственную роль");
                            return;
                        }

                        // Нельзя SuperAdmin удалять самого себя
                        if (context.Request.Method == HttpMethods.Delete &&
                            string.Equals(controller, "Users", StringComparison.OrdinalIgnoreCase) &&
                            string.Equals(action, "Delete", StringComparison.OrdinalIgnoreCase) &&
                            targetId == currentUserId.Value)
                        {
                            _logger.LogWarning("SuperAdmin попытался удалить сам себя");
                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            await context.Response.WriteAsJsonAsync("Нельзя удалить самого себя");
                            return;
                        }

                        // Яляется ли целевой пользователь тоже SuperAdmin
                        if ((context.Request.Method == HttpMethods.Patch || context.Request.Method == HttpMethods.Delete) &&
                            string.Equals(controller, "Users", StringComparison.OrdinalIgnoreCase))
                        {
                            var userService = context.RequestServices.GetRequiredService<IUserService>();
                            var targetUser = await userService.GetByIdAsync(targetId);
                            if (targetUser != null && string.Equals(targetUser.Role, "SuperAdmin", StringComparison.OrdinalIgnoreCase))
                            {
                                _logger.LogWarning("SuperAdmin попытался изменить или удалить другого SuperAdmin");
                                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                                await context.Response.WriteAsJsonAsync("Нельзя изменять или удалять других SuperAdmin");
                                return;
                            }
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}