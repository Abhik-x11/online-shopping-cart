import React from 'react';
import { useCart } from '../context/useCart';
import './Navbar.css';

/**
 * Navbar Component
 * Displays brand logo, assignment badge, search input, and interactive Cart Drawer trigger.
 */
export default function Navbar({
  searchTerm,
  onSearchChange,
  onOpenCart
}) {
  const { totals } = useCart();
  const { totalItems, grandTotal } = totals;

  return (
    <header className="shop-navbar">
      <div className="container nav-content">
        
        {/* Brand & Assignment Tag */}
        <div className="nav-brand">
          <div className="brand-logo-icon">🛍️</div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">AuraShop</span>
              <span className="assignment-badge">Assignment 5</span>
            </div>
            <p className="brand-subtitle">useReducer &bull; Context API &bull; Cart</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="nav-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search audio, watches, keyboards, gadgets..."
            className="nav-search-input"
            aria-label="Search catalog"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Cart Button with Items Badge & Grand Total Preview */}
        <div className="nav-actions">
          <button
            type="button"
            className="cart-trigger-btn"
            onClick={onOpenCart}
            aria-label={`Open Cart with ${totalItems} items`}
          >
            <div className="cart-icon-wrap">
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && (
                <span className="cart-badge-count">{totalItems}</span>
              )}
            </div>
            <div className="cart-preview-text">
              <span className="cart-preview-label">My Cart</span>
              <span className="cart-preview-total">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
