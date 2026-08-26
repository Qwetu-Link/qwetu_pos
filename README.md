# 🧾 Qwetu POS

Qwetu POS is a Next.js point-of-sale and business management app for QwetuLinks stores. It covers inventory, product catalog management, customers, orders, Lipa Mdogo collections, payments, finance workflows, reporting, analytics, role-based dashboards, and super admin operations.

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=auth0&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/Serwist_PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)

- Next.js 16 App Router with React 19 and TypeScript
- tRPC with TanStack React Query for typed client/server APIs
- Drizzle ORM with MySQL
- NextAuth for Google and credentials authentication
- Supabase Storage for product image assets
- Serwist service worker support for PWA/offline behavior
- Tailwind CSS 4, shadcn-style UI primitives, Recharts, and Lucide icons

## ✅ Requirements

- 🟢 Node.js 20 or newer
- 📦 npm
- 🗄️ MySQL database
- ☁️ Supabase project for file storage
- 🔑 Optional Google OAuth credentials for Google sign-in

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your database, auth, Supabase, and push notification values. The app reads `.env.local` during local development and Drizzle commands.

Start the development server:

```bash
npm run dev
```

Open `https://localhost:3000` or `http://localhost:3000`, depending on how the dev server is started.

For local HTTPS testing:

```bash
npm run dev -- --experimental-https
```

## 🔑 Environment Variables

### 🗄️ Database

The app uses MySQL through `mysql2` and Drizzle.

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DATABASE_POOL_MAX=5
```

### ☁️ Supabase Storage

Supabase is used for product image storage. Configure the project URL and keys:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The Next.js image configuration allows product images from the configured Supabase storage host.

### 🔐 Auth

Credentials auth is backed by users stored in the MySQL database. Google auth is available when OAuth credentials are configured.

```env
AUTH_SECRET=auth_secret_here
NEXTAUTH_SECRET=nextauth_secret_here
BETTER_AUTH_SECRET=better_auth_secret_here
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

### 🌐 App URLs and tRPC

```env
NEXT_PUBLIC_APP_URL=https://localhost:3000
NEXT_PUBLIC_TRPC_URL=https://localhost:3000/api/trpc
```

### 🔔 Push Notifications

Generate VAPID keys with `npx web-push generate-vapid-keys` or another trusted VAPID key generator.

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=public_key_here
VAPID_PRIVATE_KEY=private_key_here
VAPID_EMAIL=mailto:example@gmail.com
```

## 🗄️ Database Workflow

Drizzle schema files live in `db/schema`, with migrations in `db/migrations`.

Push the current schema to the configured database:

```bash
npm run db:push
```

Generate a migration:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Open Drizzle Studio:

```bash
npm run db:studio
```

Seed the super admin user:

```bash
npm run seed:super-user
```

## ⚙️ Available Scripts

```bash
npm run dev              # 🚀 Start the Next.js dev server with Turbopack
npm run build             # 🏗️  Build the app with Webpack and standalone output
npm run start              # ▶️  Start the standalone production server
npm run lint                # 🧹 Run ESLint
npm run db:push          # 🗄️  Push schema changes with Drizzle
npm run db:pull            # 🗄️  Pull schema from the database
npm run db:generate     # 🗄️  Generate Drizzle migrations
npm run db:migrate       # 🗄️  Apply Drizzle migrations
npm run db:studio         # 🗄️  Open Drizzle Studio
npm run seed:super-user  # 👑 Seed the initial super admin account
```

## 📁 Project Structure

```text
app/          🧭 Next.js routes, layouts, API routes, manifest, and PWA service worker
features/     🧩 Feature screens and domain-specific UI
components/   🧱 Shared layouts, primitives, tables, skeletons, and UI components
server/       🔗 tRPC router implementations and server-side business logic
trpc/         🔌 tRPC client, server, router, and query-client setup
db/           🗄️ Drizzle schema, relations, migrations, and query helpers
hooks/        🪝 Client hooks for feature data and mutations
lib/          🧰 Shared runtime utilities, PWA, offline sync, notifications, and storage helpers
services/     🖼️ Image upload and processing services
types/        🏷️ Admin, finance, and super admin TypeScript types
utils/        🧮 Formatting, permissions, roles, catalog, inventory, and order utilities
public/       🎨 Icons, splash screens, placeholders, and manifest assets
```

## 🧭 Main App Areas

- 📊 Admin dashboard: metrics, activity, role dashboards, and business operations
- 🏷️ Products and variants: catalog management, image uploads, variants, categories, and inventory
- 🧾 Orders and customers: order management, customer profiles, order details, and manual order entry
- 💳 Transactions and expenses: sales, payments, expense tracking, and transaction reporting
- 🪙 Lipa Mdogo: payment plans, collection tracking, and plan detail views
- 💼 Finance ERP: sales, reports, refunds, payroll, budgeting, expenses, customer wallets, and entities
- ⚙️ Settings: business profile, billing, team assignments, roles, permissions, and WhatsApp setup
- 👑 Super admin: businesses, administrators, subscriptions, payments, notifications, reports, and WhatsApp management

## 📶 PWA and Offline Support

The app includes installable PWA assets, Android and Apple icons, splash screens, a Serwist service worker, an offline fallback route at `/~offline`, and offline sync helpers under `lib/offline` and `lib/sync`.

PWA service worker generation is disabled in development and enabled for production builds.

## 🏗️ Production Build

Build the app:

```bash
npm run build
```

Start the standalone server:

```bash
npm run start
```

`next.config.ts` uses `output: "standalone"`, and `app.js` starts the generated standalone Next.js server.

## 📝 Notes for Contributors

- ⚠️ This project uses a newer Next.js version with breaking API and file-structure changes. Check `node_modules/next/dist/docs/` before making framework-level changes.
- 🗄️ Keep database schema changes in `db/schema` and generate migrations with Drizzle.
- 🧩 Keep feature-specific screens inside `features/` and shared UI in `components/`.
- 🔗 Use the existing tRPC routers in `server/` for typed server behavior.
- 🔒 Avoid committing real secrets. Keep local credentials in `.env.local`.