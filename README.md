# nextjs-cms

A secure web application built with Next.js, Better Auth, and Prisma.

## Quick Start

1. **Setup environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your BETTER_AUTH_SECRET
   ```

2. **Start development:**
   ```bash
   docker compose up -d postgres
   npm install
   npx prisma db push
   npm run clear-and-seed
   npm run dev
   ```

3. **Access the application:**
   - Homepage: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: admin@nextjs-cms.com / admin123

## Project Details

- **Client**: nextjs-cms
- **Project**: nextjs-cms
- **Database**: nextjs_cms
- **Admin Email**: admin@nextjs-cms.com

## Development

See the main template documentation for detailed setup and troubleshooting.
