import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { validateCoupon } from '../data/coupons';
import { CART_ACTIONS } from './cartActions';

const CART_STORAGE_KEY = 'aurashop_cart_state_v1';

// 1. Initial State with localStorage hydration
const getInitialState = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        appliedCoupon: parsed.appliedCoupon || null
      };
    }
  } catch (e) {
    console.error('Error loading cart from storage', e);
  }
  return {
    items: [],
    appliedCoupon: null
  };
};

// 3. Reducer Function for State Management
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      let updatedItems;
      if (existingIndex > -1) {
        // Increment quantity of existing item
        updatedItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        updatedItems = [...state.items, { ...product, quantity }];
      }

      return {
        ...state,
        items: updatedItems
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const { id } = action.payload;
      const updatedItems = state.items.filter((item) => item.id !== id);

      return {
        ...state,
        items: updatedItems,
        // If cart becomes empty, remove coupon automatically
        appliedCoupon: updatedItems.length === 0 ? null : state.appliedCoupon
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If reduced to 0 or less, remove item
        const updatedItems = state.items.filter((item) => item.id !== id);
        return {
          ...state,
          items: updatedItems,
          appliedCoupon: updatedItems.length === 0 ? null : state.appliedCoupon
        };
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems
      };
    }

    case CART_ACTIONS.APPLY_COUPON: {
      return {
        ...state,
        appliedCoupon: action.payload.coupon
      };
    }

    case CART_ACTIONS.REMOVE_COUPON: {
      return {
        ...state,
        appliedCoupon: null
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        items: [],
        appliedCoupon: null
      };
    }

    default:
      return state;
  }
}

// 4. Create Context
const CartContext = createContext(null);

// 5. Context Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialState);

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [state]);

  // Derived Financial Calculations: Subtotal, Coupon Discount, GST, Grand Total
  const cartTotals = useMemo(() => {
    // 1. Total Items in Cart
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

    // 2. Subtotal (Gross before discount and tax)
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 3. Coupon Discount Calculation (Reduced by percentage)
    let couponDiscount = 0;
    let validatedCoupon = state.appliedCoupon;

    if (state.appliedCoupon && subtotal > 0) {
      const check = validateCoupon(state.appliedCoupon.code, subtotal);
      if (check.isValid) {
        couponDiscount = check.discountAmount;
      } else {
        // Coupon criteria no longer met (e.g. subtotal dropped below min order)
        validatedCoupon = null;
      }
    }

    // 4. Taxable Amount (Subtotal minus discount)
    const taxableAmount = Math.max(0, subtotal - couponDiscount);

    // 5. GST Calculation (18% Standard GST: 9% CGST + 9% SGST)
    const gstRate = 18;
    const cgstAmount = Math.round(taxableAmount * 0.09);
    const sgstAmount = Math.round(taxableAmount * 0.09);
    const totalGst = cgstAmount + sgstAmount;

    // 6. Shipping Fee (Free for orders over ₹999 or empty cart)
    const isFreeShipping = subtotal >= 999 || subtotal === 0;
    const shippingFee = isFreeShipping ? 0 : 99;

    // 7. Grand Total
    const grandTotal = subtotal === 0 ? 0 : taxableAmount + totalGst + shippingFee;

    return {
      totalItems,
      subtotal,
      couponDiscount,
      validatedCoupon,
      taxableAmount,
      gstRate,
      cgstAmount,
      sgstAmount,
      totalGst,
      shippingFee,
      isFreeShipping,
      grandTotal
    };
  }, [state.items, state.appliedCoupon]);

  // Action Dispatcher Helpers
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product, quantity }
    });
  };

  const removeFromCart = (id) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { id }
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity }
    });
  };

  const applyCouponCode = (code) => {
    const result = validateCoupon(code, cartTotals.subtotal);
    if (result.isValid) {
      dispatch({
        type: CART_ACTIONS.APPLY_COUPON,
        payload: { coupon: result.coupon }
      });
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  const removeCoupon = () => {
    dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getItemQuantity = (id) => {
    const item = state.items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    appliedCoupon: cartTotals.validatedCoupon,
    totals: cartTotals,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCouponCode,
    removeCoupon,
    clearCart,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
