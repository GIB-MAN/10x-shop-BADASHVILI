# DEBUG-LOG.md

# E-commerce Application — Debugging and Testing Log

This document records the main debugging activities, identified issues, implemented improvements, and testing results throughout the development of the e-commerce application.

---

## P2 — CartContext and Price Utilities

### Identified Issues and Improvements

The cart management logic was reviewed and improved to ensure that product quantities remain within available stock limits.

- Fixed an issue where a product would not be added if the requested quantity exceeded the available stock.
- Implemented automatic calculation of the allowable quantity using `Math.min()`.
- Ensured immutable state updates when modifying cart items.
- Improved the logic to handle both newly added products and quantity increases for existing cart items.
- Added notifications on the `ProductPage` to confirm successful additions and inform users about stock limitations.
- Updated the `discountedPrice()` utility function to round discounted prices to two decimal places.
- Improved the `formatPrice()` function to display prices with a dollar sign and thousands separators.

### Result

Product additions now respect stock limitations, and users receive appropriate feedback about cart operations. Price calculations and formatting are handled consistently through reusable utility functions.

---

## P3 CORE — Product Functionality

### Implemented Improvements and Testing

- Added discounted product pricing using the `discountedPrice()` and `formatPrice()` utility functions.
- Implemented NotFound navigation for invalid product IDs and 404 API responses.
- Added product stock status and quantity validation.
- Improved cart quantity validation to prevent exceeding available stock.
- Added inline success and warning messages when adding products to the cart.
- Reset quantity and cart feedback when navigating between products.
- Verified product navigation, quantity stepper functionality, and cart stock validation.

### Result

All P3 CORE requirements were reviewed and addressed. Product functionality, stock validation, pricing, and cart interaction were verified.

---

## P4 CORE — Shopping Cart

### Implemented Improvements and Testing

The core shopping cart functionality was implemented and tested.

- Added and removed products from the cart.
- Implemented quantity updates with stock validation.
- Added discounted product prices and line totals.
- Implemented Subtotal, Discount, Shipping, and Total calculations.
- Added Clear Cart functionality.
- Implemented an empty cart state with a link to the product catalog.
- Added product detail navigation links.
- Implemented a responsive two-column layout with an Order Summary.
- Added Proceed to Checkout navigation.
- Verified cart state synchronization after cart operations.

### Result

All P4 CORE requirements passed the implemented checks.

FULL functionality has not been implemented and remains outside the scope of this stage.

---

## P5 CORE — Checkout

### Identified Issues and Implemented Fixes

During the debugging and testing phase of the Checkout module, several inconsistencies with the PRD requirements were identified and resolved.

### 1. Email Validation

**Issue:**

The error message for an empty Email field did not match the required PRD specification.

**Solution:**

Updated the Yup validation schema to display the exact message `Please enter a valid email address` for both empty and incorrectly formatted email addresses.

**Status:** Resolved.

### 2. Product Pricing

**Issue:**

Product prices displayed in the Checkout Order Summary did not account for individual product discounts.

**Solution:**

Implemented the `discountedPrice()` utility function to ensure consistent pricing between CartPage and CheckoutPage.

**Status:** Resolved.

### 3. Duplicate Total Amount

**Issue:**

The Order Summary displayed the final order total twice.

**Solution:**

Removed the redundant Total Amount element, leaving a single Total section.

**Status:** Resolved.

### 4. Validation Error Styling

**Issue:**

The Address and City fields did not display a red border when validation errors occurred.

**Solution:**

Added conditional styling based on Formik's `touched` and `errors` states to all four input fields, ensuring consistent visual feedback.

**Status:** Resolved.

### 5. Order Submission Error Handling

**Issue:**

The checkout process needed additional error feedback.

**Solution:**

Introduced a `submitError` state to display inline error messages if an issue occurs during order processing, while preserving the user's form data.

**Status:** Improved.

### 6. Formik Submission State

**Issue:**

The synchronous order submission process required appropriate handling of Formik's submission state.

**Solution:**

Added `setSubmitting(false)` in the error-handling path to ensure that the form can be submitted again if an error occurs. Formik automatically resets the submitting state after successful synchronous submission.

**Status:** Improved.

### Final Result

The Checkout module was improved to meet the P5 CORE requirements. It includes four controlled input fields, validation with appropriate error messages, an Order Summary with discount calculations, local order confirmation, and automatic cart clearing after successful submission.

No real payment processing or credit card data collection is implemented, in accordance with the project requirements.

---

## Overall Summary

The debugging and testing activities improved the application's cart management, product functionality, pricing consistency, form validation, and checkout experience.

The implementation follows the existing React and TypeScript architecture and uses reusable utility functions and context-based state management.

The documented improvements and testing activities correspond to the P2, P3 CORE, P4 CORE, and P5 CORE development stages.