# Furniture E-commerce - Current Base

React + Vite furniture e-commerce frontend.

## Backend

Base backend used by the frontend:

`https://graduationecommerce.runasp.net`

During local development, requests to `/api/*` are sent through the Vite dev proxy configured in `vite.config.js` to avoid browser CORS restrictions.

Implemented documented API areas:

- Account: register, login, profile
- Products: list, details, current-user products, create, update, delete
- Cart: add, increase, decrease, clear
- Wishlist: frontend/local account-scoped storage because no Wishlist API was provided
- Orders / checkout / payment: frontend-only flow because no corresponding backend endpoints were provided
- Search/filter/sort: frontend based on the Product list because no Search endpoint was provided

## Product response handling

The Product service accepts the documented direct array response and also tolerates common JSON wrapper shapes (`products`, `data`, `$values`) without changing the API endpoint.

## Important Cart API limitation

The documented Cart API has no `GET /api/Cart` endpoint and no single-item delete endpoint. The frontend therefore keeps a local display cache for the cart and uses the documented add/increase/decrease/clear operations against the backend. It does not invent a GET endpoint.

## Run

```bash
npm install
npm run dev
```

Then open the Vite localhost URL shown in the terminal.
