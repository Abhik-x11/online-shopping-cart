import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import './App.css';

function MainShopContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="aura-shop-app">
      {/* 1. Header Navigation */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Promotional Announcement Ticker */}
      <div className="promo-ticker-bar">
        <div className="container ticker-content">
          <span className="ticker-badge">SPECIAL OFFERS</span>
          <span className="ticker-text">
            🏷️ Use code <strong>SAVE10</strong> for 10% OFF &bull; <strong>FESTIVE20</strong> for 20% OFF on orders over ₹2,000 &bull; 🚚 <strong>FREE Delivery</strong> over ₹999 &bull; Standard 18% GST itemized on invoice
          </span>
        </div>
      </div>

      <main className="main-content">
        {/* Hero Section */}
        <section className="shop-hero container">
          <div className="hero-assignment-tag">
            <span>Assignment 5 &bull; useReducer / Context API / State Management</span>
          </div>
          <h2 className="hero-headline">Next-Gen Gadgets &amp; Peripherals</h2>
          <p className="hero-subtext">
            Explore curated tech essentials with real-time state management, percentage coupon discounts, 
            and complete GST billing breakdown.
          </p>
        </section>

        {/* 3. Product Catalog Grid with Category Filtering & Sorting */}
        <ProductList
          searchTerm={searchTerm}
          onToast={showToast}
        />
      </main>

      {/* 4. Footer */}
      <footer className="shop-footer container">
        <div className="footer-flex">
          <span>AuraShop eCommerce &bull; Assignment 5: useReducer, Context API &amp; GST Calculation</span>
          <div className="footer-links">
            <span>100% Authentic Tech</span>
            <span>&bull;</span>
            <span>Secure 18% GST Invoicing</span>
            <span>&bull;</span>
            <span>Instant Coupon Rebates</span>
          </div>
        </div>
      </footer>

      {/* 5. Cart Drawer (Sliding Sidebar) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleProceedToCheckout}
        onToast={showToast}
      />

      {/* 6. Checkout Invoice Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 7. Action Toast Alert */}
      <Toast
        toast={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainShopContent />
    </CartProvider>
  );
}
