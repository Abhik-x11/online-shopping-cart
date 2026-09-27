import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/useCart';
import './CheckoutModal.css';

/**
 * CheckoutModal Component
 * Shows order confirmation invoice with itemized receipt, GST, and coupon discounts.
 */
export default function CheckoutModal({ isOpen, onClose }) {
  const { items, appliedCoupon, totals, clearCart } = useCart();

  // Pure state initialization for invoice identifiers
  const [orderId] = useState(() => `AURA-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(() =>
    new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  const handleDone = useCallback(() => {
    clearCart();
    onClose();
  }, [clearCart, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleDone();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDone]);

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
    grandTotal
  } = totals;

  return (
    <div className="modal-backdrop" onClick={handleDone} role="dialog" aria-modal="true">
      <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Success Icon Badge */}
        <div className="checkout-icon-badge">🎉</div>

        <h2 className="checkout-title">Order Placed Successfully!</h2>
        <p className="checkout-subtitle">
          Thank you for shopping with AuraShop. Your invoice has been generated.
        </p>

        {/* Invoice Summary Box */}
        <div className="invoice-box">
          <div className="invoice-header-row">
            <div>
              <span className="invoice-label">Order Number</span>
              <span className="invoice-id">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="invoice-label">Date &amp; Time</span>
              <span className="invoice-date">{orderDate}</span>
            </div>
          </div>

          {/* Itemized list */}
          <div className="invoice-items-list">
            <span className="items-header-label">Purchased Items ({totalItems}):</span>
            {items.map((item) => (
              <div key={item.id} className="invoice-item-row">
                <span className="invoice-item-name">
                  {item.image} {item.name} &times; <strong>{item.quantity}</strong>
                </span>
                <span className="invoice-item-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="invoice-calculations">
            <div className="calc-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="calc-row discount">
                <span>Coupon Discount ({appliedCoupon?.code} - {appliedCoupon?.discountPercentage}%)</span>
                <span>− ₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="calc-row">
              <span>Taxable Value</span>
              <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="calc-row gst">
              <span>GST 18% (CGST ₹{cgstAmount} + SGST ₹{sgstAmount})</span>
              <span>+ ₹{totalGst.toLocaleString('en-IN')}</span>
            </div>

            <div className="calc-row">
              <span>Delivery Fee</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>

            <div className="calc-row total-row">
              <span>Grand Total Paid</span>
              <span className="total-highlight">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="checkout-modal-actions">
          <button
            type="button"
            className="btn btn-primary continue-btn"
            onClick={handleDone}
          >
            🛍️ Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
