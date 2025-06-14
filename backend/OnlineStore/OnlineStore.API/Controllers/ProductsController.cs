using Microsoft.AspNetCore.Mvc;
using OnlineStore.Application.Interfaces;
using OnlineStore.Application.DTO;
using OnlineStore.Domain.Entities;

namespace OnlineStore.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductsController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    // GET: api/Products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
    {
        var products = await _productRepository.GetAllAsync();

        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl
        });

        return Ok(productDtos);
    }

    // GET: api/Products/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        var dto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl
        };

        return Ok(dto);
    }

    // POST: api/Products
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Преобразование DTO → Entity
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl
        };

        await _productRepository.AddAsync(product);
        return Ok(product);
        //return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        
    }

    // PUT: api/Products/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _productRepository.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        // Обновляем только изменяемые поля, ID остается прежним
        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.Price = dto.Price;
        existing.ImageUrl = dto.ImageUrl;

        await _productRepository.UpdateAsync(existing);

        return Ok(id);
    }


    // DELETE: api/Products/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        await _productRepository.DeleteAsync(id);
        return Ok(id);
    }
}
