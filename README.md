# BookStore

BookStore is a full-stack online bookstore application with an ASP.NET Core Web API backend and a React frontend. It supports genres, authors, cart management, authentication, checkout, reviews, and customer account features.

## Features

### Customer / public features

- Home page with featured bookstore sections.
- Browse all books, new arrivals, editor picks, genres, and authors.
- Book detail pages with reviews and related content.
- Search and sorting support.
- Guest cart stored locally, with cart synchronization after login.
- User registration and login using JWT authentication.
- Customer profile and address management.
- Checkout flow using Stripe.
- Order tracking and customer orders.

### Admin features

- Admin dashboard route protected by role-based authorization.
- Backend API endpoints protected with the `Admin` role where required.

## Tech stack

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core 8
- SQL Server
- ASP.NET Core Identity
- JWT Bearer authentication
- MediatR / CQRS-style application layer
- FluentValidation
- AutoMapper
- Serilog
- Stripe.net
- CloudinaryDotNet

### Frontend

- React 19
- TypeScript
- React Router DOM v7
- Zustand (cart state)
- Axios
- React Hook Form + Zod
- Bootstrap 5 + Bootstrap Icons
- Lucide React (icons)
- Sonner (toasts)
- Framer Motion


## Project structure

- `backEnd/BookStoreApi/BookStoreApi` — ASP.NET Core API host project.
- `backEnd/BookStore.Application` — commands, queries, DTOs, validators, application services, and MediatR handlers.
- `backEnd/BookStore.Domain` — entities, constants, exceptions, repository contracts, and views.
- `backEnd/BookStore.Infrastructure` — EF Core DbContext, migrations, repository implementations, external services, identity, and seed data.
- `frontEnd` — React application.
- `frontEnd/src/pages` — route-level page components.
- `frontEnd/src/components` — reusable UI components (including `admin/` and `customer/` subgroups).
- `frontEnd/src/services` — Axios API service modules and `auth/` subgroup (`authService`, `tokenUtils`, `useAuthStore`).
- `frontEnd/src/store` — Zustand store (`useCartStore`).
- `frontEnd/src/types` — TypeScript interfaces and types.
- `frontEnd/src/utils` — utility helpers (`imageUtils`, `stringUtils`, `toast`).

## Prerequisites

Install the following before running the project:

- .NET SDK 8
- SQL Server or SQL Server Express / LocalDB
- Node.js 18+ LTS
- npm
- Stripe account — required for real checkout payments
- Cloudinary account — required for real image upload/storage features

## Backend setup

1. Restore backend packages:

   ```bash
   dotnet restore backEnd/BookStoreApi/BookStoreApi.sln
   ```

2. Configure local backend settings in `backEnd/BookStoreApi/BookStoreApi/appsettings.Development.json`.

   Use your own local values. Do not commit real secrets.

   ```json
   {
     "ConnectionStrings": {
       "BookStoreDb": "Server=.;Database=BookStoreDb;Integrated Security=SSPI;TrustServerCertificate=True;MultipleActiveResultSets=True"
     },
     "Authentication": {
       "SecretKey": "replace-with-a-long-secure-secret-key",
       "Issuer": "bookstore-api",
       "Audience": "bookstore-api"
     },
     "Stripe": {
       "SecretKey": "your-stripe-secret-key",
       "WebhookSecret": "your-stripe-webhook-secret",
       "SuccessUrl": "http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}",
       "CancelUrl": "http://localhost:5173/checkout"
     },
     "CloudinarySettings": {
       "CloudName": "your-cloudinary-cloud-name",
       "ApiKey": "your-cloudinary-api-key",
       "ApiSecret": "your-cloudinary-api-secret"
     }
   }
   ```

3. Apply database migrations:

   ```bash
   dotnet ef database update --project backEnd/BookStore.Infrastructure --startup-project backEnd/BookStoreApi/BookStoreApi
   ```

   If `dotnet ef` is not installed, install it first:

   ```bash
   dotnet tool install --global dotnet-ef
   ```

4. Run the API:

   ```bash
   dotnet run --project backEnd/BookStoreApi/BookStoreApi
   ```

5. Open Swagger:

   - `https://localhost:7097/swagger`
   - `http://localhost:5298/swagger`

## Frontend setup

1. Install frontend packages:

   ```bash
   npm install --prefix frontEnd
   ```

2. Configure the development API base URL in `frontEnd/.env.development`:

   ```env
   VITE_API_URL=https://localhost:7097/api
   ```

3. Start the Vite development server:

   ```bash
   npm --prefix frontEnd run dev
   ```

4. Open the frontend:

   - `http://localhost:5173`

## Useful commands

### Backend

- Restore packages: `dotnet restore backEnd/BookStoreApi/BookStoreApi.sln`
- Build solution: `dotnet build backEnd/BookStoreApi/BookStoreApi.sln`
- Run API: `dotnet run --project backEnd/BookStoreApi/BookStoreApi`
- Apply migrations: `dotnet ef database update --project backEnd/BookStore.Infrastructure --startup-project backEnd/BookStoreApi/BookStoreApi`

### Frontend

- Install packages: `npm install --prefix frontEnd`
- Start dev server: `npm --prefix frontEnd run dev`
- Build production bundle: `npm --prefix frontEnd run build`
- Preview production build: `npm --prefix frontEnd run preview`
- Lint: `npm --prefix frontEnd run lint`

## API overview

The API is served under `/api`.

Common endpoints include:

- `POST /api/identity/registerUser`
- `POST /api/identity/loginUser`
- `GET /api/identity/me`
- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/books/featured`
- `GET /api/books/editors-picks`
- `GET /api/books/genre/{genreId}`
- `GET /api/categories`
- `GET /api/authors`
- `GET /api/carts/me`
- `POST /api/carts/items`
- `POST /api/carts/sync`
- `POST /api/carts/preview`
- `POST /api/checkout/create-session`
- `GET /api/orders`
- `GET /api/notifications`
- `POST /api/newsletter`

Use Swagger for the complete and current API contract.

## Configuration notes

- `appsettings.json` contains placeholders only.
- `appsettings.Development.json` is intended for local development secrets and should stay out of source control.
- The frontend reads the API base URL from the `VITE_API_URL` environment variable via `import.meta.env.VITE_API_URL`.
- For production builds, set `VITE_API_URL` in `frontEnd/.env.production` or your deployment environment.
- Stripe webhooks require the configured webhook secret to match your Stripe CLI or Stripe dashboard endpoint.
- The Stripe `SuccessUrl` and `CancelUrl` should point to `localhost:5173` in development (Vite's default port), not `localhost:4200`.

## Build status checked during review

The following checks were run successfully:

- Backend: `dotnet build backEnd/BookStoreApi/BookStoreApi.sln --no-restore`
- Frontend: `npm --prefix frontEnd run build`

The backend build completed with a package security warning for `AutoMapper 15.1.0`. The frontend build completed with Vite bundle size warnings.

## Security notes

- Never commit real Stripe keys, Cloudinary secrets, JWT signing secrets, or production connection strings.
- Rotate any secret that was accidentally committed or shared.
- Prefer environment variables, user secrets, or deployment secret managers for production.
- Do not commit `.env.development` or `.env.production` files containing real secrets.

## License

This project is licensed under the MIT License.
