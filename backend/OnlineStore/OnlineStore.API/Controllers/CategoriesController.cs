using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;

namespace OnlineStore.API.Controllers
{
    [Authorize(Policy = "AdminPolicy")]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            _logger.LogInformation("Получение всех категорий");
            var categories = await _categoryService.GetAllAsync();

            return Ok(categories);
        }

        [AllowAnonymous]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CategoryDto>> GetById(Guid id)
        {
            _logger.LogInformation($"Получение категории по Id {id}");
            var category = await _categoryService.GetById(id);
            if (category == null)
            {
                _logger.LogWarning($"Категория с Id {id} не найдена");
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
        {
            try
            {
                var created = await _categoryService.AddAsync(dto);
                _logger.LogInformation($"Создана новая категория с Id {created.Id}");
                return Ok(created);
            }
            catch
            {
                _logger.LogError("Ошибка при создании категории");
                return StatusCode(500, "Ошибка сервера при создании категории.");
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromBody] UpdateCategoryDto dto, Guid id)
        {
            var updated = await _categoryService.UpdatedAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _categoryService.DeleteAsync(id);
            if (!deleted)
            {
                _logger.LogWarning($"Не удалось найти категорию с Id {id}");
                return NotFound();
            }

            return Ok(id);
        }
    }
}
