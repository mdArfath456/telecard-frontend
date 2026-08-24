# TeleCard Frontend

Modern React + Vite frontend designed against the uploaded TeleCard Spring Boot backend.

## Stack
- React 18
- Vite
- React Router
- Axios
- Modern responsive CSS with micro-interactions and reduced visual clutter
- HttpOnly JWT cookie compatible authentication

## Run

```bash
npm install
npm run dev
```

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Backend integration

Implemented against these backend routes:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/refresh`
- `/api/auth/logout`
- `/api/user/profile`
- `/api/user/change-password`
- `/api/user/account`
- `/api/cards/**`
- `/api/categories/**`
- `/api/cart/**`
- `/api/orders/**`
- `/api/payments/**`
- `/api/admin/**`

The frontend sends `withCredentials: true` so the backend's `jwt` and `refreshJwt` HttpOnly cookies are used.

## Pages

### Storefront
- Home
- Card catalog
- Search and category filtering
- Card details
- Register
- Login
- Cart
- Selected-item checkout
- Manual payment screenshot submission
- Orders
- Order details
- Profile and password change

### Admin
- Overview dashboard
- Card CRUD + status management
- Category CRUD + activation
- Order status management
- Order fulfillment / card-detail assignment
- Payment review / verification / rejection
- User management / blocking / activation / role changes

## Production CORS

The uploaded backend currently allows `http://localhost:5173` in its CORS configuration. For a deployed frontend, update the backend `CorsConfig` allowed origin to the deployed frontend URL and keep `allowCredentials=true`.

For cross-site HTTPS cookies, configure the backend cookie settings as appropriate, typically `secure=true` and `same-site=None`.

## Build verification

The environment used to package this project did not have access to the npm registry, so dependency installation/build could not be completed here. The source package is provided without `node_modules`; run `npm install` and `npm run build` locally.
