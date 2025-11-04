# Next.js Auth Template

A production-ready authentication template built with Next.js 16, Better Auth, Prisma, and Docker. Perfect for agencies and consultants building secure web applications for multiple clients.

## 🚀 Features

- **Modern Stack**: Next.js 16 with App Router, TypeScript, Tailwind CSS v4
- **Secure Authentication**: Better Auth with email/password and social providers
- **Database**: Prisma ORM with PostgreSQL and connection pooling
- **Containerized**: Docker Compose for development and production
- **Protected Routes**: Admin dashboard with session management
- **Responsive Design**: Mobile-first with dark mode support
- **Template System**: Automated client project generation
- **Performance Optimized**: Suspense boundaries, loading states, optimized Prisma

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── login/          # Authentication page
│   │   ├── admin/          # Protected admin dashboard
│   │   └── api/auth/       # Better Auth API routes
│   ├── components/         # React components
│   │   ├── auth-form.tsx   # Login/signup form
│   │   ├── auth-loading.tsx # Loading skeleton
│   │   └── admin-dashboard.tsx # Admin interface
│   └── lib/               # Auth configuration and utilities
├── prisma/                # Database schema and migrations
├── scripts/               # Utility and generation scripts
├── docker-compose.yml     # Container orchestration
└── template.config.js     # Template configuration
```

## 🛠️ Quick Start

### Option 1: Use as Template Repository (Recommended for Clients)

1. **Click "Use this template" on GitHub** or clone:
   ```bash
   git clone https://github.com/bokk3/nextjs-auth-template.git my-client-project
   cd my-client-project
   ```

2. **Setup environment:**
   ```bash
   cp .env.local.example .env.local
   # Generate a secret: openssl rand -base64 32
   # Edit .env.local and add your BETTER_AUTH_SECRET
   ```

3. **Start development:**
   ```bash
   docker compose up -d postgres
   npm install
   npx prisma db push
   npm run clear-and-seed
   npm run dev
   ```

### Option 2: Use Project Generator (For Multiple Clients)

```bash
node scripts/create-project.js acme-corp "Acme Corporation"
cd ../acme-corp
# Follow setup steps above
```

## 🌐 Access Points

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login  
- **Admin Dashboard**: http://localhost:3000/admin
- **Default Admin**: admin@example.com / admin123

## 🏗️ Client Project Workflow

### For Agencies/Consultants:

1. **Keep this repo as your master template**
2. **For each client**: Use GitHub's "Use this template" or the project generator
3. **Customize**: Update branding, colors, client-specific features
4. **Deploy**: Each client gets their own isolated environment

### Template Variables Replaced:
- Project names and display names
- Database names and container names  
- Admin email addresses
- Branding and company names
- Domain configurations

## 🐳 Docker Configuration

### Development
```bash
# Start database only
docker compose up -d postgres

# Full stack (optional)
docker compose up
```

### Production
```bash
# Build and deploy
docker compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

### Required in `.env.local`:
```env
# Database (auto-configured for Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_auth_template

# Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🛠️ Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run clear-and-seed  # Reset database and create admin user
npm run create-admin    # Create admin user only
npm run reset-admin     # Reset admin user
```

## 🚨 Common Issues & Solutions

### 1. **Database Connection Issues**

**Error**: `Can't reach database server at postgres:5432`

**Solution**: Environment variable mismatch
```bash
# Check your .env.local file
# For local development, use:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_auth_template

# For Docker containers, use:
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextjs_auth_template
```

### 2. **Prisma Schema Sync Issues**

**Error**: `The table 'public.accounts' does not exist`

**Solution**: Schema and database out of sync
```bash
# Regenerate Prisma client and push schema
npx prisma generate
npx prisma db push
npm run clear-and-seed
# Restart dev server
```

### 3. **TypeScript Path Resolution**

**Error**: `Cannot find module '@/components/auth-form'`

**Solution**: Path alias configuration
```bash
# Check tsconfig.json has:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Or use relative imports:
import { AuthForm } from "../components/auth-form"
```

### 4. **Better Auth 405 Method Not Allowed**

**Error**: `405 Method not allowed` on auth endpoints

**Solution**: API route handler configuration
```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "../../../../lib/auth"

const handler = auth.handler
export { handler as GET, handler as POST }
```

### 5. **Slow Initial Load Times**

**Issue**: 7-9 second compile times on first request

**Solutions Applied**:
- Global Prisma client instance (prevents multiple connections)
- Reduced logging in development
- Suspense boundaries with loading states
- Optimized Better Auth configuration
- Connection pooling

### 6. **Docker Network Issues**

**Error**: Old network names after renaming project

**Solution**: Clean up and recreate
```bash
docker compose down
docker network prune
docker compose up -d postgres
```

### 7. **Environment File Precedence**

**Issue**: Wrong environment variables loaded

**Next.js Environment Priority**:
1. `.env.local` (highest priority - for secrets)
2. `.env.development` 
3. `.env` (lowest - for defaults)

**Solution**: Ensure secrets are in `.env.local`

## 🔒 Security Best Practices

### Environment Variables
- ✅ Use `.env.local` for secrets (not committed)
- ✅ Use `.env.local.example` as template (committed)
- ✅ Generate strong `BETTER_AUTH_SECRET` (32+ characters)
- ✅ Never commit actual secrets to git

### Database
- ✅ Use connection pooling in production
- ✅ Enable SSL in production
- ✅ Regular backups
- ✅ Separate databases per client

### Authentication
- ✅ Email verification (can be enabled)
- ✅ Session management with expiration
- ✅ Protected routes with proper redirects
- ✅ Password hashing via Better Auth

## 🚀 Production Deployment

### Recommended Stack:
- **Hosting**: Vercel, Railway, or Docker containers
- **Database**: Supabase, PlanetScale, or managed PostgreSQL
- **Monitoring**: Sentry for error tracking
- **Analytics**: Vercel Analytics or Google Analytics

### Environment Setup:
```env
NODE_ENV=production
DATABASE_URL=your-production-db-url
BETTER_AUTH_SECRET=your-production-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

This template is designed for client work. To contribute:

1. Fork the repository
2. Create a feature branch
3. Test with the project generator
4. Submit a pull request

## 📄 License

MIT License - Perfect for client projects and commercial use.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables
3. Ensure Docker containers are running
4. Check Prisma schema sync
5. Restart development server

For additional help, create an issue with:
- Error messages
- Environment details
- Steps to reproduce