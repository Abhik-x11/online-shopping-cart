# 🛍️ AuraShop - Online Shopping Cart

**Assignment 5: Online Shopping Cart using State Management**  
Built with **React**, **Vite**, **useReducer**, **Context API**, and **Vanilla CSS**.

---

## 📌 Project Overview

AuraShop is a modern, high-performance eCommerce shopping cart application. It uses React's **`useReducer`** and **`Context API`** to manage global cart state, dynamic quantity updates, percentage-based coupon discounts, and comprehensive **GST (18%) taxation breakdowns**.

---

## ✨ Assignment 5 Requirements Implemented

| Requirement | Implementation Details | Key Files |
| :--- | :--- | :--- |
| **`useReducer` & State Management** | Centralized reducer handling actions: `ADD_TO_CART`, `REMOVE_FROM_CART`, `UPDATE_QUANTITY`, `APPLY_COUPON`, `REMOVE_COUPON`, `CLEAR_CART`. | [`cartActions.js`](src/context/cartActions.js), [`CartContext.jsx`](src/context/CartContext.jsx) |
| **Context API** | `CartProvider` and custom `useCart()` hook making state, dispatch actions, and computed totals accessible everywhere without prop drilling. | [`CartContext.jsx`](src/context/CartContext.jsx), [`useCart.js`](src/context/useCart.js) |
| **Product List** | Curated catalog of electronic gadgets with category filter pills (*Audio, Wearables, Peripherals, Power, Accessories*), search input, and sort controls. | [`ProductList.jsx`](src/components/ProductList.jsx), [`ProductCard.jsx`](src/components/ProductCard.jsx) |
| **Add to Cart** | Add items with single click, triggering instant badge count animations, total updates, and feedback toasts. | [`ProductCard.jsx`](src/components/ProductCard.jsx) |
| **Remove Item** | Dedicated delete button (`🗑️`) on each cart item with immediate total adjustments. | [`CartDrawer.jsx`](src/components/CartDrawer.jsx) |
| **Quantity Update** | Responsive stepper controls (`−` / `+`) on both product cards and cart line items; auto-removes item if quantity drops to 0. | [`ProductCard.jsx`](src/components/ProductCard.jsx), [`CartDrawer.jsx`](src/components/CartDrawer.jsx) |
| **Coupon Code Facility** | Input field supporting percentage discount codes with validation rules. Features active coupon tags, one-click removal, and clickable suggestions (*SAVE10, FESTIVE20, SUPER30, WELCOME50*). | [`coupons.js`](src/data/coupons.js), [`CartDrawer.jsx`](src/components/CartDrawer.jsx) |
| **GST Calculation** | Itemized **18% Standard GST** calculated on the post-discount taxable amount: **CGST 9% + SGST 9%**. | [`CartContext.jsx`](src/context/CartContext.jsx), [`CartDrawer.jsx`](src/components/CartDrawer.jsx) |
| **Grand Total** | Computed dynamically: `Taxable Amount + GST (18%) + Shipping Fee` with free delivery unlocked on orders above ₹999. | [`CartContext.jsx`](src/context/CartContext.jsx) |

---

## 🎟️ Available Coupon Codes

- **`SAVE10`**: Flat 10% OFF on all orders (no minimum purchase).
- **`FESTIVE20`**: Special 20% OFF on orders over ₹2,000.
- **`SUPER30`**: Mega 30% OFF on orders over ₹4,000.
- **`WELCOME50`**: 50% OFF up to ₹1,200 for new shoppers (min ₹1,500).

---

## 🌟 Extra Features

1. **Sliding Cart Drawer**: Smooth slide-in cart drawer keeping the shopping flow uninterrupted.
2. **Order Confirmation & Invoice Modal**: Clicking "Proceed to Checkout" produces an itemized tax invoice receipt with simulated order number.
3. **Data Persistence**: Uses browser `localStorage` to keep cart items and applied coupons safe across reloads.
4. **Action Toast Notifications**: Real-time feedback alerts when items are added, quantities change, or coupons are applied.

---

## 🚀 How to Run Locally

1. **Navigate to the project folder**:
   ```bash
   cd online-shopping-cart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:5175/`** in your web browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🐙 How to Upload this Project to GitHub

### Step 1: Install Git (if not already installed)
If you don't have Git installed:
- Download the installer from: [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)
- Or install via PowerShell:
  ```powershell
  winget install --id Git.Git -e --source winget
  ```

### Step 2: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click the **`+`** icon in the upper right and select **New repository**.
3. Name your repository (e.g. `online-shopping-cart` or `react-shopping-cart-reducer`).
4. Set to **Public** (or Private).
5. **Do not** check "Add a README file" (this project already includes one).
6. Click **Create repository**.
7. Copy the HTTPS repository URL (e.g. `https://github.com/<your-username>/online-shopping-cart.git`).

### Step 3: Initialize Git and Push your Code
Open PowerShell inside `C:\Users\abhik\.gemini\antigravity-ide\scratch\online-shopping-cart` and run:

```powershell
# 1. Initialize git on the main branch
git init -b main

# 2. Add all project files
git add .

# 3. Commit the project
git commit -m "Assignment 5: Online Shopping Cart with useReducer, Context API, Coupons & GST"

# 4. Link your remote repository (replace with your URL)
git remote add origin https://github.com/<your-username>/online-shopping-cart.git

# 5. Push to GitHub
git push -u origin main
```

*(If prompted, authenticate using your browser or GitHub Personal Access Token).*
