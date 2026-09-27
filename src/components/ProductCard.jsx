import React from 'react';
import { useCart } from '../context/useCart';
import './ProductCard.css';

/**
 * ProductCard Component
 * Displays product details and integrates with CartContext to Add/Update Quantity.
 */
export default function ProductCard({ product, onToast }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    addToCart(product, 1);
    if (onToast) onToast(`🛒 Added "${product.name}" to cart!`);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <article className="product-card">
      
      {/* Product Image & Badge Box */}
      <div className="product-img-box" style={{ borderColor: `${product.colorAccent}33` }}>
        {product.badge && (
          <span className="product-badge" style={{ background: `${product.colorAccent}22`, color: product.colorAccent }}>
            {product.badge}
          </span>
        )}
        <div className="product-avatar" style={{ textShadow: `0 8px 25px ${product.colorAccent}55` }}>
          {product.image}
        </div>
      </div>

      {/* Product Information */}
      <div className="product-body">
        
        <div className="product-category-row">
          <span className="product-category">{product.category}</span>
          <div className="product-rating">
            <span className="star-icon">⭐</span>
            <span className="rating-score">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc">{product.description}</p>

        {/* Pricing */}
        <div className="product-price-row">
          <div className="price-group">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span className="discount-tag">{discountPercent}% OFF</span>
        </div>

        {/* Action Button: Add to Cart / Quantity Controller */}
        <div className="product-actions-wrap">
          {quantity === 0 ? (
            <button
              type="button"
              className="btn btn-add-cart"
              onClick={handleAdd}
            >
              <span>🛒 Add to Cart</span>
            </button>
          ) : (
            <div className="in-cart-controller">
              <button
                type="button"
                className="qty-btn"
                onClick={handleDecrement}
                title="Decrease quantity"
              >
                −
              </button>
              <span className="qty-value">{quantity} in cart</span>
              <button
                type="button"
                className="qty-btn"
                onClick={handleIncrement}
                title="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>

      </div>

    </article>
  );
}
