using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;

namespace OnlineStore.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            _logger.LogInformation("Получение списка всех товаров");
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProductDto>> GetById(Guid id)
        {
            _logger.LogInformation($"Получение товара по ID: {id}");
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning($"Товар с ID {id} не найден");
                return NotFound();
            }

            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto dto)
        {
            try
            {
                var createdProduct = await _productService.CreateAsync(dto);
                _logger.LogInformation($"Создан новый товар с ID {createdProduct.Id}");
                return Ok(createdProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании товара");
                return StatusCode(500, "Ошибка сервера при создании товара.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _productService.UpdateAsync(id, dto);
            if (!updated)
            {
                _logger.LogWarning($"Не удалось обновить товар с ID {id}: не найден");
                return NotFound();
            }

            _logger.LogInformation($"Товар с ID {id} успешно обновлён");
            return Ok(id);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _productService.DeleteAsync(id);
            if (!deleted)
            {
                _logger.LogWarning($"Не удалось удалить товар с ID {id}: не найден");
                return NotFound();
            }

            _logger.LogInformation($"Товар с ID {id} успешно удалён");
            return Ok(id);
        }
    }
}
