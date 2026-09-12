# GofitEcommerceapp

A full-stack, role-based e-commerce platform for a fitness/gym-equipment store, built as two separate repositories: a **Spring Boot REST API** backend and an **Angular 17** single-page frontend.

| | |
|---|---|
| **Backend repo** | [EcommerceBackend](https://github.com/anshendkar/EcommerceBackend) |
| **Frontend repo** | [ecomUI](https://github.com/anshendkar/ecomUI) |
| **Domain** | Fitness equipment e-commerce (products, cart, wishlist, coupons, orders, order tracking, reviews) |
| **Access model** | Two roles — `ADMIN` and `CUSTOMER` — sharing one login, routed to separate app areas |

---

## 1. Tech Stack

**Backend — `EcommerceBackend`**

| Layer | Technology |
|---|---|
| Language / Runtime | Java 17 |
| Framework | Spring Boot 3.5.3 |
| Security | Spring Security 6, stateless JWT (`io.jsonwebtoken` / jjwt 0.12.6), BCrypt password hashing |
| Persistence | Spring Data JPA / Hibernate |
| Database | MySQL (`mysql-connector-j`) |
| Caching | Redis (Spring Data Redis + Lettuce client) |
| Build | Maven |
| Other | Lombok, Bean Validation (`spring-boot-starter-validation`), multipart file upload for product images and review photos |

**Frontend — `ecomUI`**

| Layer | Technology |
|---|---|
| Framework | Angular 17 (standalone components — no `NgModule`-based feature modules) |
| UI Kit | Angular Material + Bootstrap 5 |
| State/Auth | `localStorage`-backed `UserStorageService`, `HttpInterceptorFn` for JWT injection |
| Routing | Lazy-loaded route groups (`/admin/**`, `/customer/**`) protected by functional route guards |

---

## 2. High-Level Architecture

```
                         ┌─────────────────────────────┐
                         │        Angular 17 SPA        │
                         │   (ecomUI — port 4200)       │
                         │                              │
                         │  ┌────────┐   ┌───────────┐  │
                         │  │ Admin  │   │ Customer  │  │
                         │  │ module │   │  module   │  │
                         │  └────────┘   └───────────┘  │
                         │        route guards           │
                         │   (adminGuard / customerGuard)│
                         └──────────────┬───────────────┘
                                        │ HTTPS + JWT (Authorization: Bearer)
                                        │ auth.interceptor attaches token
                                        ▼
                         ┌─────────────────────────────┐
                         │     Spring Boot REST API     │
                         │  (EcommerceBackend — 8080)   │
                         │                              │
                         │  JwtFilter → SecurityConfig  │
                         │        (stateless)           │
                         │                              │
                         │  Controllers                 │
                         │   /auth/**                    │
                         │   /api/admin/**               │
                         │   /api/customer/**             │
                         │                              │
                         │  Services → Repositories      │
                         │  (JPA)                        │
                         └────────┬───────────┬──────────┘
                                  │           │
                        ┌─────────▼───┐   ┌───▼─────────┐
                        │   MySQL     │   │   Redis     │
                        │  ecom_app   │   │  (product   │
                        │  (JPA/      │   │  cache,     │
                        │  Hibernate) │   │  TTL 1–10m) │
                        └─────────────┘   └─────────────┘

           Local disk: /uploads (product images), /reviews (review images)
           served back as static resources at /uploads/** and /reviews/**
```

**Request flow (typical authenticated call):**
1. User logs in via `POST /auth/login` → backend verifies credentials with `AuthenticationManager` + `BCryptPasswordEncoder`, issues a signed HMAC JWT (1-hour expiry) and returns the user's profile (including `userRole`).
2. Angular's `auth.interceptor` reads the token from `localStorage` and attaches it as `Authorization: Bearer <token>` on every outgoing request.
3. `JwtFilter` (a `OncePerRequestFilter`) validates the token on each request and populates the `SecurityContext`.
4. `SecurityConfig` allows public endpoints (`/auth/**`, `/uploads/**`, `/reviews/**`, `/order/**`, `/auth/track/**`) and requires authentication for everything else.
5. Controllers delegate to services, which use Spring Data JPA repositories against MySQL; product listings are additionally cached in Redis.

---

## 3. Role-Based Access Control (RBAC)

Access control here is **route/URL-convention-based**, split across two layers:

- **Backend:** All admin endpoints live under `/api/admin/**`, all customer endpoints under `/api/customer/**`. Spring Security currently only distinguishes *public* vs *authenticated* — the `/api/admin` vs `/api/customer` split is enforced by URL convention and by the frontend routing, not by `hasRole()`/`@PreAuthorize` checks in the backend today. `UserRole` is stored on the `User` entity as `ADMIN` or `CUSTOMER`, returned in the login response, but is **not currently embedded as a JWT claim** or checked per-endpoint on the server side.
- **Frontend:** After login, the user's role is persisted (`UserStorageService.saveUser`). Two functional route guards gate navigation:
  - `adminGuard` → requires `userRole === 'ADMIN'`, else redirects to `/login`
  - `customerGuard` → requires `userRole === 'CUSTOMER'`, else redirects to `/login`

  `app.routes.ts` lazy-loads `admin/admin-routing.ts` behind `adminGuard` and `customer/customer-routing.ts` behind `customerGuard`. On login, the component reads the returned role and navigates to `/admin/dashboard` or `/customer/dashboard` accordingly.
- **Bootstrap admin:** On application startup, `AuthService.createAdminAccount()` seeds a default `ADMIN` user (`admin@test.com`) if no admin exists yet, so the admin console has a way in on a fresh database.

> ⚠️ **Design note for hardening:** because role checks live only in the Angular guards and URL convention, a valid JWT for a `CUSTOMER` account is technically accepted by the JVM for an `/api/admin/**` call as well (any *authenticated* request passes `SecurityConfig`). Recommended next step: add the role as a JWT claim and enforce `hasRole("ADMIN")` / `hasRole("CUSTOMER")` per path in `SecurityConfig`, or use method-level `@PreAuthorize`.

---

## 4. Low-Level Design

### 4.1 Backend package structure

```
com.ecom.gofitEcommerce
├── config/
│   ├── SecurityConfig.java     # filter chain, CORS, BCrypt bean, static resource handlers
│   ├── JwtFilter.java          # per-request JWT validation → SecurityContext
│   └── RedisConfig.java        # Lettuce connection factory, cache manager (products/product caches)
├── controller/
│   ├── AuthController.java     # /auth/sign-up, /auth/login
│   ├── TrackingController.java # /auth/track/{trackingId} — public order tracking
│   ├── admin/                  # /api/admin/** — category, product, coupon, order, analytics
│   └── customer/               # /api/customer/** — products, cart, wishlist, reviews
├── service/
│   ├── AuthService.java, UserDetailService.java
│   ├── admin/                  # AdminProductService, AdminOrderService, AdminCouponService, CategoryService, FAQService
│   └── customer/                # CustomerProductService, cart/CartService, review/ReviewService, wishlist/WishlistService
├── repository/                 # Spring Data JPA repositories, one per entity
├── entity/                     # JPA entities (see schema below)
├── enums/                      # UserRole, OrderStatus
├── DTO/                        # request/response payloads (see below)
└── utils/                      # JwtUtil, Mapper
```

### 4.2 REST API surface (as implemented)

**Auth — public**
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/sign-up` | Register a new customer account |
| POST | `/auth/login` | Authenticate, returns `{ token, user }` |
| GET | `/auth/track/{trackingId}` | Public order tracking by UUID |

**Admin — `/api/admin`** (product/catalog & order management console)
| Method | Path | Purpose |
|---|---|---|
| POST | `/category` | Create a category |
| GET | `/all` | List all categories |
| POST | `/addproduct` *(multipart)* | Create a product with image |
| GET | `/products` | Paginated product list |
| GET | `/search/{name}` | Search products by name |
| GET | `/products/{productId}` | Product detail |
| PUT | `/product/{productId}` | Update product |
| DELETE | `/product/{productId}` | Delete product |
| POST | `/faq/{productId}` | Add FAQ to a product |
| POST | `/coupons` | Create coupon |
| GET | `/coupons` | List coupons |
| GET | `/placedOrders` | List all placed orders |
| GET | `/order/{orderId}/{status}` | Update order status |
| GET | `/analytics` | Sales/order analytics summary |

**Customer — `/api/customer`** (storefront)
| Method | Path | Purpose |
|---|---|---|
| GET | `/products` | Paginated product catalog |
| GET | `/search/{name}` | Search products |
| GET | `/product/{productId}` | Product detail |
| POST | `/cart` | Add item to cart |
| GET | `/cart/{userId}` | Get user's cart |
| POST | `/addition` / `/decrease` | Adjust cart item quantity |
| DELETE | `/cart/{userId}/{productId}` | Remove item from cart |
| GET | `/coupon/{userId}/{code}` | Validate/apply coupon |
| POST | `/placeOrder` | Place an order |
| GET | `/my-placed-orders/{userId}` | Order history |
| GET | `/ordered-products/{orderId}` | Products within an order |
| POST | `/reviews/` *(multipart)* | Submit a review (rating, text, photo) |
| POST | `/wishlist` / `GET /wishlist/{userId}` / `DELETE /wishlist/{userId}/{productId}` | Wishlist management |

### 4.3 Database schema (JPA entities → tables)

| Table | Key columns | Relationships |
|---|---|---|
| `users` | `id`, `email` (unique), `password` (BCrypt hash), `name`, `role` (`ADMIN`/`CUSTOMER`), `img` (LONGBLOB) | referenced by orders, cart items, reviews, wishlists |
| `product_tbl` | `id`, `name`, `price`, `description`, `imgUrl` | `category_id` → `category_tbl` (many-to-one, cascade delete) |
| `category_tbl` | `id`, `name`, `description` | parent of `product_tbl` |
| `cartItems_tbl` | `id`, `price`, `quantity` | `product_id` → product, `user_id` → user, `order_id` → order |
| `orders_tbl` | `id`, `orderDescription`, `date`, `amount`, `address`, `payment`, `orderStatus` (enum: `Pending`/`Placed`/`Shipped`/`Delivered`), `totalAmount`, `discount`, `trackingId` (UUID) | `user_id` → user, `coupon_id` → coupon (optional), one-to-many → cart items |
| `coupons_tbl` | `id`, `name`, `code`, `discount`, `expirationDate` | referenced by orders |
| `review_tbl` | `id`, `rating`, `description`, `imgUrl` | `user_id` → user, `product_id` → product |
| `wishlists_tbl` | `id` | `product_id` → product, `user_id` → user |
| `faq_tbl` | `id`, `question`, `answer` | `product_id` → product |

Notes:
- `ddl-auto: update` — schema is auto-managed by Hibernate against a MySQL database named `ecom_app`.
- Most foreign keys use `@OnDelete(CASCADE)` at the Hibernate level (category deletion cascades to products, etc.).
- A new user's signup transactionally creates a placeholder `Order` row (amount 0, status `Pending`) alongside the `User`.

### 4.4 Frontend structure (Angular 17)

```
src/app
├── app.routes.ts                # top-level routes: /login, /register, /track-order, /admin (guarded), /customer (guarded)
├── guards/                      # adminGuard, customerGuard (CanActivateFn)
├── interceptor/                 # auth.interceptor — attaches JWT, handles 401/403 → forced logout
├── storage/                     # UserStorageService — localStorage wrapper for token/user/role
├── services/                    # AuthService (shared)
├── compoenents/
│   ├── login/, register/
├── admin/
│   ├── admin-routing.ts         # dashboard, category, product, post-coupon, coupons, orders, faq, analytics
│   ├── admin-components/        # one folder per screen
│   └── service/                 # admin.service, product.service
├── customer/
│   ├── customer-routing.ts      # dashboard, cart, my-orders, wishlist, product detail, review, ordered-products
│   ├── customer-components/
│   └── services/                # customer.service
└── track-order/                 # public order tracking screen
```

Auth/session flow on the client:
1. `LoginComponent` posts credentials to `AuthService.login()`.
2. On success, JWT and user object are saved via `UserStorageService`.
3. Role read from the saved user object determines redirect: `ADMIN` → `/admin/dashboard`, `CUSTOMER` → `/customer/dashboard`.
4. `authInterceptor` attaches the bearer token to every subsequent HTTP call and force-logs-out on `401`/`403`.

---

## 5. Local Setup

### Prerequisites
- Java 17, Maven
- Node.js + Angular CLI 17
- MySQL running locally, Redis running locally

### Backend
```bash
# create database
mysql -u root -p -e "CREATE DATABASE ecom_app;"

# configure src/main/resources/application.yml with your MySQL/Redis credentials
# then run:
./mvnw spring-boot:run
```
API starts on `http://localhost:8080`. A default admin account (`admin@test.com`) is seeded automatically on first startup if no admin exists.

### Frontend
```bash
npm install
ng serve
```
App starts on `http://localhost:4200` (matches the CORS origin allowed by the backend's `SecurityConfig`).

---

## 6. Known Gaps / Suggested Hardening

- **Server-side role enforcement:** add role as a JWT claim and enforce `hasRole(...)` per `/api/admin/**` and `/api/customer/**` path (currently enforced only by the Angular guards/URL convention — see §3).
- **Secrets in config:** DB credentials and the JWT signing key currently live in plaintext in `application.yml`; move to environment variables / a secrets manager before any shared or production deployment.
- **File storage:** uploaded product/review images are stored on local disk (`/uploads`, `/reviews`); consider object storage (S3-compatible) for anything beyond local dev.

