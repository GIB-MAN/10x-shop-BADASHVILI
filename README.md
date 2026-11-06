# 10x Shop

A modern e-commerce web application built with **React, TypeScript,
Vite, and Tailwind CSS**.

------------------------------------------------------------------------

## 📖 Project Description

**10x Shop** is a responsive e-commerce web application designed to
provide users with a convenient online shopping experience.

The application allows users to:

-   Browse available products.
-   View detailed product information.
-   Manage shopping cart items.
-   Apply promotional codes.
-   Access authentication and checkout pages.

Product information is retrieved from the [DummyJSON Products
API](https://dummyjson.com/docs/products).

------------------------------------------------------------------------

## ✨ Features

### 1. Product Management

-   Browse products in a responsive product grid.
-   View detailed product information.
-   Display product images, descriptions, brands, and categories.
-   Display product ratings and customer reviews.
-   Show product stock availability.
-   Display discounted prices.
-   Calculate prices after discounts.
-   Browse related products.

### 2. Shopping Cart

-   Add products to the shopping cart.
-   Increase or decrease product quantities.
-   Display available stock limitations.
-   Remove products from the cart.
-   Manage cart items using **React Context**.

### 3. Promotional Codes

-   Enter promotional codes.
-   Validate promotional codes through the application's promo code
    handler.
-   Display success and error messages.
-   Remove an applied promotional code.

### 4. Authentication and Checkout

-   Login page.
-   Authentication state management using **React Context**.
-   Protected route component.
-   Checkout page.
-   Checkout form types and validation-related dependencies.

------------------------------------------------------------------------

## 🛠️ Technologies Used

### Frontend

  Technology       Version Purpose
  -------------- --------- -----------------------------------
  React                 19 UI development
  TypeScript             6 Static typing
  React Router           7 Application routing
  Tailwind CSS           4 Styling
  Vite                   8 Development server and build tool

### Form Management and Validation

  Technology   Purpose
  ------------ -----------------------
  Formik       Form state management
  Yup          Form validation

### API

  Service                  Purpose
  ------------------------ ------------------------
  DummyJSON Products API   Product data retrieval

### Development Tools

-   ESLint
-   TypeScript Compiler
-   Vite

------------------------------------------------------------------------

## 📁 Project Structure

``` text
src/
├── api/
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
│
├── components/
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProtectedRoute.tsx
│   ├── QuantityPicker.tsx
│   ├── RelatedProducts.tsx
│   ├── RemoveButton.tsx
│   └── ScrollToTop.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── pages/
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── ProductPage.tsx
│
├── types/
│   └── index.ts
│
├── utils/
│   └── price.ts
│
├── App.css
├── App.tsx
├── main.tsx
└── index.css
```

------------------------------------------------------------------------

## 📂 Directory Overview

  -----------------------------------------------------------------------
  Directory / File                    Description
  ----------------------------------- -----------------------------------
  `api/`                              Application modules grouped under
                                      the API directory.

  `components/`                       Reusable UI components.

  `context/`                          Shared authentication and shopping
                                      cart state management.

  `pages/`                            Main application pages.

  `types/`                            Shared TypeScript type definitions.

  `utils/`                            Reusable utility functions,
                                      including price calculations and
                                      formatting.

  `App.tsx`                           Main application component.

  `main.tsx`                          Application entry point.

  `App.css`                           Application-level styles.

  `index.css`                         Global styles.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🚀 Installation and Setup

### Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   npm (included with Node.js)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

``` bash
git clone https://github.com/YOUR_GITHUB_USERNAME/10x-shop-BADASHVILI.git
```

### 2. Navigate to the Project Directory

``` bash
cd 10x-shop-BADASHVILI
```

### 3. Install Dependencies

``` bash
npm install
```

### 4. Start the Development Server

``` bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

------------------------------------------------------------------------

## 📜 Available Scripts

The following commands are available in the project:

  -----------------------------------------------------------------------
  Command                             Description
  ----------------------------------- -----------------------------------
  `npm run dev`                       Starts the development server.

  `npm run build`                     Runs TypeScript checks and creates
                                      a production build.

  `npm run lint`                      Runs ESLint.

  `npm run typecheck`                 Runs TypeScript checks.

  `npm run preview`                   Previews the production build.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🌐 API Information

The application uses the **DummyJSON Products API** to retrieve product
information.

**API Documentation:** [DummyJSON Products
API](https://dummyjson.com/docs/products)

### Product Data

The API provides the following product information:

-   Product ID
-   Title
-   Description
-   Price
-   Discount percentage
-   Stock availability
-   Thumbnail and product images
-   Category
-   Brand
-   Rating
-   Reviews

------------------------------------------------------------------------

## 💰 Price Utilities

The application includes reusable price utility functions located in
`src/utils/price.ts`.

  -----------------------------------------------------------------------
  Function                            Description
  ----------------------------------- -----------------------------------
  `discountedPrice()`                 Calculates the final price after
                                      applying a discount percentage.

  `formatPrice()`                     Formats prices as USD currency.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🧪 Quality Assurance

The project can be checked using the following commands.

### Run ESLint

``` bash
npm run lint
```

### Run TypeScript Checks

``` bash
npm run typecheck
```

### Create a Production Build

``` bash
npm run build
```

### Current Verification Status

  Check              Status
  ------------------ ------------
  ESLint             0 errors
  TypeScript         0 errors
  Production Build   Successful

------------------------------------------------------------------------

## 🔗 Live Demo

**Deployment Status:** Not deployed yet.

A live demo link will be added after deployment.

------------------------------------------------------------------------

## 📸 Screenshots

Application screenshots will be added after the final deployment.

------------------------------------------------------------------------

## 👨‍💻 Author

**BADASHVILI**

-   **GitHub Repository:**
    [10x-shop-BADASHVILI](https://github.com/YOUR_GITHUB_USERNAME/10x-shop-BADASHVILI)

------------------------------------------------------------------------

## 📄 License

This project was developed as an educational project.
