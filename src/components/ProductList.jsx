import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { products, categories } from '../data/products';
import './ProductList.css';

/**
 * ProductList Component
 * Filters products by Category, Search, and Sort orders.
 */
export default function ProductList({ searchTerm, onToast }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured order
        break;
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <section className="product-list-section container">
      
      {/* Category Pills and Sort Bar */}
      <div className="filter-sort-bar">
        
        {/* Category Pills */}
        <div className="category-pills-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls & Counter */}
        <div className="sort-controls-wrap">
          <span className="results-counter">
            Showing <strong>{filteredProducts.length}</strong> items
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="featured">Featured Gadgets</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>

      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="no-products-card">
          <span className="no-products-icon">🔍</span>
          <h3>No Gadgets Found</h3>
          <p>
            No products matched your search "{searchTerm}" in category "{selectedCategory}".
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSelectedCategory('All')}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onToast={onToast}
            />
          ))}
        </div>
      )}

    </section>
  );
}
