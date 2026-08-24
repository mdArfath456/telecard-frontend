# TeleCard Frontend Fixes

## React useEffect crash fixed

The runtime warning:

`useEffect must not return anything besides a function`

was caused by asynchronous work being returned from an effect callback. The authentication bootstrap was the main offender because the callback expression returned the Promise created by the dynamic import/API chain.

The following areas were hardened:

- `src/context/AuthContext.jsx`
- `src/pages/Cart.jsx`
- `src/pages/Home.jsx`
- `src/pages/Orders.jsx`
- `src/pages/Profile.jsx`
- `src/pages/CardDetails.jsx`
- `src/pages/admin/AdminOverview.jsx`
- `src/pages/admin/AdminPayments.jsx`

Each effect now uses the pattern:

```js
useEffect(() => {
  let mounted = true;

  const load = async () => {
    // await API here
  };

  load();

  return () => {
    mounted = false;
  };
}, []);
```

This prevents React from treating a Promise as the effect cleanup function and fixes the `destroy is not a function` crash.

## Authentication route protection

Added `src/components/PublicOnlyRoute.jsx`.

Authenticated users can no longer open:

- `/login`
- `/register`

A logged-in ADMIN is redirected to `/admin`.
A logged-in USER is redirected to the requested protected page or `/cards`.

User-only routes are now restricted to `USER`:

- `/cart`
- `/checkout`
- `/orders`
- `/orders/:id`
- `/profile`

ADMIN users are redirected to `/admin` when attempting to enter those routes.

## Session bootstrap

`AuthContext` now restores the current profile using an internal async function and returns only a real cleanup function from `useEffect`.

If authentication and refresh both fail with HTTP 401, the stale local user session is cleared.

## Validation

The source tree was checked for `useEffect(async ...` patterns. No direct async `useEffect` callbacks remain.

`npm install` could not complete in this execution environment because npm registry access timed out, so a local Vite production build should still be run with:

```bash
npm install
npm run build
```
