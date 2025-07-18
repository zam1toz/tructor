# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Database Setup

This project uses Drizzle ORM with PostgreSQL. Follow these steps to set up the database:

1. **Install PostgreSQL** and create a database named `tructor`

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/tructor
   ```

3. **Generate and run migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Optional: Use Drizzle Studio** to view and edit data:
   ```bash
   npm run db:studio
   ```

### Email Setup

This project uses React Email for transactional emails. Follow these steps to set up email functionality:

1. **Add email configuration to `.env`**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@tructor.com
   ```

2. **For Gmail users**:
   - Enable 2-factor authentication
   - Generate an App Password (Google Account → Security → App Passwords)
   - Use the App Password as `EMAIL_PASS`

3. **Add email column to database**:
   Run this SQL in Supabase SQL Editor:
   ```sql
   ALTER TABLE users ADD COLUMN email TEXT;
   CREATE INDEX users_email_idx ON users(email);
   ```

4. **Test email configuration**:
   ```bash
   npm run test:email
   ```

### Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:seed` - Seed database with initial test data

### Supabase RLS Policies

This project uses Row Level Security (RLS) policies for data protection. Use the following SQL scripts in Supabase SQL Editor:

#### Fix RLS Policies
Run `supabase-fix-rls-policies.sql` to:
- Recreate the `is_admin()` function
- Check current policy status
- Verify user statistics
- Test policy functionality

#### Test RLS Policies  
Run `supabase-test-policies.sql` to:
- Verify `is_admin()` function exists
- Check detailed policy status
- Confirm RLS activation
- Analyze policy conditions
- Test policy behavior

**Important**: Always test policies in Supabase SQL Editor before applying to production.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
