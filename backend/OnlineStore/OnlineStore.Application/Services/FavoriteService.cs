using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OnlineStore.Application.DTO;
using OnlineStore.Application.Interfaces;
using OnlineStore.Domain.Entities;
using OnlineStore.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IProductRepository _productRepository;
        public FavoriteService(IFavoriteRepository favoriteRepository, IProductRepository productRepository)
        {
            _favoriteRepository = favoriteRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<FavoriteDto>> GetFavoritesForUserAsync(Guid userId)
        {
            var favorites = await _favoriteRepository.GetFavoritesForUserAsync(userId);

            return favorites.Select(f => new FavoriteDto
            {
                Id = f.Id,
                UserId = f.UserId,
                Product = new ProductDto
                {
                    Id = f.Product.Id,
                    Name = f.Product.Name,
                    Description = f.Product.Description,
                    Price = f.Product.Price,
                    ImageUrl = f.Product.ImageUrl,
                    CategoryId = f.Product.CategoryId,
                    CategoryName = f.Product.Category?.Name
                }
            });
        }

        public async Task<bool> ToggleFavoriteAsync(Guid userId, Guid productId)
        {
            var productExists = await _productRepository.GetByIdAsync(productId);
            if (productExists == null)
            {
                throw new InvalidOperationException($"Товар c Id {productId} не существует или был удалён.");
            }

            var favorite = await _favoriteRepository.GetByUserAndProductAsync(userId, productId);
            if (favorite != null)
            {
                await _favoriteRepository.DeleteAsync(favorite.Id, userId);
                return false; 
            }

            var newFavorite = new Favorite
            {
                UserId = userId,
                ProductId = productId,
            };

            await _favoriteRepository.AddAsync(newFavorite);
            return true; 
        }
    }
}
