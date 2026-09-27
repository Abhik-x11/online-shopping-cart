import React, { useState, useEffect } from 'react';
import { useCart } from '../context/useCart';
import { availableCoupons } from '../data/coupons';
import './CartDrawer.css';

/**
 * CartDrawer Component
 * Interactive shopping cart drawer handling:
 * - Product list in cart
 * - Remove item
 * - Quantity update
 * - Coupon code application & percentage discount
 * - GST calculation (18%: CGST 9% + SGST 9%)
 * - Grand Total computation
 */
export default function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
  onToast
}) {
  const {
    items,
    appliedCoupon,
    totals,
    removeFromCart,
    updateQuantity,
    applyCouponCode,
    removeCoupon,
    clearCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Handle ESC key to close cart drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    totalItems,
    subtotal,
    couponDiscount,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    totalGst,
    shippingFee,
    isFreeShipping,
    grandTotal
  } = totals;

  // Handle Coupon Submit
  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    const res = applyCouponCode(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
      if (onToast) onToast(`🎟️ Applied coupon "${code.toUpperCase()}"!`);
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
    if (onToast) onToast('Coupon removed.');
  };

  return (
    <div className="cart-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <aside 
        className="cart-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title-wrap">
            <span className="cart-header-icon">🛒</span>
            <div>
              <h2 className="cart-header-title">Shopping Cart</h2>
              <span className="cart-header-count">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <div className="cart-header-actions">
            {items.length > 0 && (
              <button 
                type="button" 
                className="cart-clear-link" 
                onClick={clearCart}
                title="Remove all items"
              >
                Clear Cart
              </button>
            )}
            <button 
              type="button" 
              className="cart-close-btn" 
              onClick={onClose}
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {items.length > 0 && (
          <div className="shipping-banner">
            {isFreeShipping ? (
              <span className="free-shipping-active">
                ✨ <strong>Congratulations!</strong> You unlocked <strong>FREE Delivery</strong>!
              </span>
            ) : (
              <span>
                🚚 Add <strong>₹{(999 - subtotal).toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>!
              </span>
            )}
          </div>
        )}

        {/* Drawer Body: Item List or Empty State */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <span className="cart-empty-icon">🛍️</span>
              <h3 className="cart-empty-title">Your Cart is Empty</h3>
              <p className="cart-empty-desc">
                Looks like you haven't added any electronic gadgets or accessories yet.
              </p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={onClose}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <div key={item.id} className="cart-item-card">
                    {/* Item Avatar */}
                    <div className="item-avatar-box">
                      <span className="item-avatar-emoji">{item.image}</span>
                    </div>

                    {/* Details */}
                    <div className="item-details">
                      <div className="item-title-row">
                        <h4 className="item-name">{item.name}</h4>
                        <button
                          type="button"
                          className="item-delete-btn"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="item-price-tag">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </div>

                      {/* Quantity Controller & Line Total */}
                      <div className="item-controls-row">
                        <div className="item-qty-stepper">
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="stepper-qty">{item.quantity}</span>
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="item-line-total">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer: Coupon Code & GST Bill Breakdown */}
        {items.length > 0 && (
          <div className="cart-footer">
            
            {/* 1. Coupon Section */}
            <div className="coupon-card">
              <div className="coupon-input-group">
                <span className="coupon-icon">🎟️</span>
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. SAVE10)..."
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  className="coupon-input"
                  aria-label="Coupon code"
                />
                <button
                  type="button"
                  className="coupon-apply-btn"
                  onClick={() => handleApplyCoupon()}
                >
                  Apply
                </button>
              </div>

              {/* Coupon Inline Feedback */}
              {couponError && <p className="coupon-msg-error">⚠️ {couponError}</p>}
              {couponSuccess && <p className="coupon-msg-success">{couponSuccess}</p>}

              {/* Active Applied Coupon Pill */}
              {appliedCoupon && (
                <div className="active-coupon-tag">
                  <div className="tag-info">
                    <span className="tag-badge">APPLIED</span>
                    <span className="tag-code">{appliedCoupon.code}</span>
                    <span className="tag-percent">({appliedCoupon.discountPercentage}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={handleRemoveCoupon}
                    title="Remove coupon"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              {/* Quick Coupon Chips */}
              <div className="coupon-chips-list">
                <span className="chips-label">Available:</span>
                {availableCoupons.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`coupon-chip ${appliedCoupon?.code === c.code ? 'selected' : ''}`}
                    onClick={() => handleApplyCoupon(c.code)}
                    title={c.description}
                  >
                    {c.code} ({c.discountPercentage}%)
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Comprehensive Bill Summary with GST & Grand Total */}
            <div className="bill-summary-card">
              <h3 className="bill-summary-title">Order Summary</h3>

              {/* Subtotal */}
              <div className="bill-row">
                <span className="bill-label">Cart Subtotal ({totalItems} items)</span>
                <span className="bill-val">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Coupon Discount (Percentage deduction) */}
              {couponDiscount > 0 && (
                <div className="bill-row discount-row">
                  <span className="bill-label">
                    Coupon Discount ({appliedCoupon?.code} - {appliedCoupon?.discountPercentage}%)
                  </span>
                  <span className="bill-val discount-val">
                    − ₹{couponDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Taxable Amount */}
              <div className="bill-row sub-row">
                <span className="bill-label">Taxable Value</span>
                <span className="bill-val">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* GST Calculation (18% Breakdown) */}
              <div className="bill-row gst-row">
                <div className="gst-label-wrap">
                  <span className="bill-label">GST (18% Standard)</span>
                  <span className="gst-split">CGST 9% (₹{cgstAmount}) + SGST 9% (₹{sgstAmount})</span>
                </div>
                <span className="bill-val gst-val">+ ₹{totalGst.toLocaleString('en-IN')}</span>
              </div>

              {/* Shipping Fee */}
              <div className="bill-row">
                <span className="bill-label">Delivery Charges</span>
                <span className="bill-val">
                  {isFreeShipping ? (
                    <span className="free-shipping-text">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              {/* Grand Total */}
              <div className="bill-row grand-total-row">
                <div className="grand-total-label-wrap">
                  <span className="grand-total-label">Grand Total</span>
                  <span className="grand-total-sublabel">Inclusive of all taxes &amp; GST</span>
                </div>
                <span className="grand-total-amount">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 3. Checkout Button */}
            <button
              type="button"
              className="btn btn-primary checkout-btn"
              onClick={onCheckout}
            >
              <span>🔒 Proceed to Checkout</span>
              <span className="checkout-total-pill">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </button>

          </div>
        )}

      </aside>
    </div>
  );
}
