/**
 * Coupon Codes Dataset
 * Offers percentage discounts on the shopping cart with validation rules.
 */
export const availableCoupons = [
  {
    code: 'SAVE10',
    discountPercentage: 10,
    minOrderValue: 0,
    description: 'Flat 10% OFF on all orders with no minimum purchase!'
  },
  {
    code: 'FESTIVE20',
    discountPercentage: 20,
    minOrderValue: 2000,
    description: 'Special 20% OFF on orders above ₹2,000.'
  },
  {
    code: 'SUPER30',
    discountPercentage: 30,
    minOrderValue: 4000,
    description: 'Mega 30% OFF on premium orders above ₹4,000.'
  },
  {
    code: 'WELCOME50',
    discountPercentage: 50,
    minOrderValue: 1500,
    maxDiscount: 1200,
    description: '50% OFF up to ₹1,200 for new shoppers (Min ₹1,500).'
  }
];

/**
 * Validate and compute discount for a coupon code given the current subtotal
 */
export function validateCoupon(code, subtotal) {
  const normalizedCode = (code || '').trim().toUpperCase();
  const coupon = availableCoupons.find((c) => c.code === normalizedCode);

  if (!coupon) {
    return {
      isValid: false,
      message: `Coupon code "${normalizedCode}" is invalid. Please try SAVE10, FESTIVE20, or SUPER30.`
    };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      message: `Coupon "${coupon.code}" requires a minimum cart subtotal of ₹${coupon.minOrderValue.toLocaleString('en-IN')}. (Current: ₹${subtotal.toLocaleString('en-IN')})`
    };
  }

  // Calculate discount amount
  let discountAmount = Math.round((subtotal * coupon.discountPercentage) / 100);
  if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
    discountAmount = coupon.maxDiscount;
  }

  return {
    isValid: true,
    coupon,
    discountAmount,
    message: `🎉 Coupon "${coupon.code}" applied! You saved ${coupon.discountPercentage}% (₹${discountAmount.toLocaleString('en-IN')})!`
  };
}
