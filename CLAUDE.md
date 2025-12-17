# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClickNShip is a multi-tenant React web application for managing e-commerce operations including orders, products, customers, couriers, and billing. Built with Vite, React 19, TypeScript, Material UI, and Redux Toolkit (RTK Query).

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Entry Point
- `src/main.tsx` → `src/app.tsx` - Root with providers (Redux, Router, Auth, Confirm dialogs)

### Multi-Tenancy
Tenant is extracted from subdomain (`useTenant` hook):
- Dev: `tenant.localhost` (requires 2+ parts)
- Prod: `tenant.domain.com` (requires 3+ parts)
- Invalid tenant shows NotFound page via `TenantGuard`

### State Management
- **RTK Query** (`src/api/index.ts`) - All API calls use RTK Query with automatic token injection
- **Auth Context** (`src/context/auth.tsx`) - Authentication state with JWT token refresh flow
- Tokens stored in localStorage (`access_token`, `refresh_token`)

### API Layer (`src/api/`)
Each domain has its own file that injects endpoints into the base API:
```typescript
// Pattern: api.injectEndpoints({ endpoints: (build) => ({ ... }) })
export const ordersApi = api.injectEndpoints({ ... });
export const { useGetOrderQuery, useCreateOrderMutation } = ordersApi;
```
- Base URL: `http://{hostname}/api/v1/`
- Automatic token refresh on 401 with "jwt expired" message

### Routing (`src/app.tsx`)
- Public routes: `/login`, `/signup`, `/reset-password`
- Protected routes wrapped in `PrivateRoute` → `DashboardLayout`
- All pages use React.lazy() for code splitting

### Forms Pattern
Forms use react-hook-form with Yup validation:
```
src/pages/{page}/form.ts    - Hook with useForm, validation schema, submit handler
src/pages/{page}/index.tsx  - UI consuming the form hook
```

### Component Structure
- `src/components/` - Shared UI components (Dialog, Drawer, Button, etc.)
- `src/components/form/` - Form field wrappers using react-hook-form Controller
- `src/layouts/dashboard.tsx` - Main layout with Appbar + Drawer sidebar
- `src/pages/` - Page components, each feature in its own folder

### Types (`src/types/`)
TypeScript types organized by domain (orders, products, users, etc.)

### Path Alias
`@/*` maps to `./src/*`
