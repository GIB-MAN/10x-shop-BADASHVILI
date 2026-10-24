# 10X Shop — Project Plan
## 1. Project Overview

10X Shop is a responsive single-page e-commerce application built with React, TypeScript, Tailwind CSS v4, and the DummyJSON API.

The goal is to develop a functional online shop where users can browse products, view product details, manage a shopping cart, log in through a local authentication simulation, and complete a checkout flow with a simulated order confirmation.

The project will prioritize all required CORE features before considering any optional enhancements.
## 2. Goals and Scope
Core Features
Project Setup: Configure Vite, React, TypeScript strict mode, and Tailwind CSS v4.
Routing: Implement client-side navigation using React Router.
Authentication: Create a controlled login form and manage login/logout state through React Context.
Product Catalog: Fetch and display products from DummyJSON API with loading, error, and empty states.
Product Details: Display product information and allow users to select a quantity and add products to the cart.
Shopping Cart: Implement shared cart state, quantity updates, item removal, and subtotal/total calculation.
Checkout: Build a controlled form with required fields and basic validation.
Order Confirmation: Simulate order placement, display a confirmation message, and clear the cart.
Responsive UI: Ensure all core pages work on mobile and desktop screens.
Quality Assurance: Verify TypeScript, production build, main user flows, and deployment.
Out of Scope

The initial implementation will not include optional FULL or BONUS features such as advanced search and filtering, pagination, promo codes, product reviews, related products, Orders/Profile pages, or advanced optimization features.

These features may only be considered after all CORE acceptance criteria have been satisfied and if additional scope is explicitly approved.

## 3. Technology Stack
React — Functional components, props, children, hooks, and Context.
TypeScript — Strict typing for components, state, API responses, and form data.
Vite — Development server and production build tooling.
Tailwind CSS v4 — Utility-first styling and responsive layouts.
React Router — Client-side routing and protected checkout navigation.
DummyJSON API — Product data source.
Git and GitHub — Version control and public repository.
Vercel or Netlify — Production deployment.

Only the dependencies necessary for the CORE requirements will be added.

## 4. Project Structure

The codebase will be organized by responsibility to keep components reusable and maintainable.

text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── products/
│       ├── ProductCard.tsx
│       └── ProductGrid.tsx
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/
│   ├── CatalogPage.tsx
│   ├── LoginPage.tsx
│   ├── ProductDetailsPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   └── NotFoundPage.tsx
├── types/
│   ├── product.ts
│   ├── cart.ts
│   └── forms.ts
├── App.tsx
├── main.tsx
└── index.css


The structure may be adjusted during implementation when necessary, without adding unnecessary abstractions.

## 5. Development Timeline
--- Week 1 — Foundation, Authentication, and Catalog

### October 17–23, 2026

Initialize the Vite + React + TypeScript project.
Configure TypeScript strict mode, scripts, and Tailwind CSS v4.
Create the GitHub repository and maintain a meaningful Git history.
Define the core TypeScript interfaces and types.
Set up the shared layout, header, and React Router routes.
Implement AuthContext and the controlled login form.
Redirect unauthenticated users from checkout to login.
Fetch and display products from DummyJSON API.
Create reusable ProductCard and ProductGrid components.

Expected outcome: The application foundation, routing, local login simulation, and product catalog are functional.

--- Week 2 — Product Details, Cart, and Checkout

### October 24–30, 2026

Implement product details using route parameters and the API.
Handle invalid product IDs without crashing the application.
Add product quantity selection and Add to Cart functionality.
Implement CartContext with immutable state updates.
Display cart items, quantities, removal controls, and totals.
Synchronize cart state with the header cart badge.
Implement checkout form fields: full name, email, address, and city.
Add required-field validation and controlled form handling.
Simulate order placement, show confirmation, and clear the cart.
Review the required React concepts used throughout the application.

Expected outcome: The complete core shopping flow works from product selection to order confirmation.

--- Week 3 — Responsive Design, Testing, and Delivery

### October 31 – November 6, 2026

Finalize responsive layouts for all core pages.
Test the application at 375px width and desktop resolutions.
Add appropriate hover, focus, and disabled states.
Verify loading, error, empty, and invalid-route states.
Test the complete user journey from catalog to checkout.
Run TypeScript type checking and the production build.
Fix discovered bugs and verify there is no horizontal overflow.
Deploy the application to Vercel or Netlify.
Verify direct route access and page refresh after deployment.
Complete README.md, PLAN.md, and REPORT.md.
Review the repository and submit the final GitHub link before the deadline.

Expected outcome: A tested, responsive, deployed application that satisfies the CORE acceptance criteria.

## 6. Acceptance Criteria

The project will be considered complete when all the following conditions are met:

The application runs successfully with npm install and npm run dev.
npm run typecheck completes with zero TypeScript errors.
npm run build completes successfully.
Tailwind CSS v4 styles work correctly.
All required routes are implemented and client-side navigation works without full-page reloads.
Login and logout state is managed through React Context.
Unauthenticated checkout access redirects to login and returns to checkout after login.
Products are fetched from DummyJSON API and displayed correctly.
Product details include the required information and handle invalid IDs safely.
Products can be added to the cart, removed, and updated in quantity.
Cart totals and the header badge update correctly.
Checkout validation prevents submission when required fields are missing.
Successful order simulation displays confirmation and empties the cart.
Loading, error, empty, and relevant interactive states are handled.
Core pages are responsive at 375px and desktop widths.
The deployed application supports direct access and refresh on nested routes.
README.md, PLAN.md, and REPORT.md are included in the repository.
The public GitHub repository contains meaningful commits and the final deployment URL.
## 7. Implementation Rules
Implement CORE requirements first.
Do not implement FULL or BONUS features without explicit approval.
Use local React Context to simulate authentication; no real authentication service is required.
Simulate checkout and order placement locally; no real payment integration is required.
Ensure TypeScript types accurately reflect the implemented data and functionality.
Use Tailwind CSS utilities for the actual application components.
Handle API errors and invalid data without crashing the application.
Keep components reusable and state updates immutable where appropriate.
Commit changes regularly with clear, meaningful commit messages.
Understand and be able to explain the implemented code and technical decisions.
## 8. Final Deliverables and Deadlines
Public GitHub repository: 10x-shop-{name}
README.md: English documentation with setup instructions, features, technologies, and deployment URL.
PLAN.md: Project goals, scope, and development timeline.
REPORT.md: Summary of implementation, completed requirements, results, and limitations.
Live deployment: Vercel or Netlify URL.
Final repository submission deadline: November 6, 2026, at 23:59 Georgia time.
Theoretical test: November 5, 2026.
Project defense: November 7–8, 2026.

The final implementation must satisfy the CORE acceptance criteria before submission. Any changes made after the submission deadline may not be considered during evaluation.