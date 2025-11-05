# 🏢 Small Business CMS

A comprehensive content management system built for small businesses, featuring multilingual support, project portfolios, contact management, and GDPR compliance.

---

## 🚀 Quick Start

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
   - Admin Panel: http://localhost:3000/admin
   - Login: admin@nextjs-cms.com / admin123

## 🏗️ Architecture

Built with modern web technologies:
- ⚛️ **Frontend**: Next.js 15 with TypeScript
- 🔐 **Authentication**: Better Auth with role-based access
- 🐘 **Database**: PostgreSQL with Prisma ORM
- 🎨 **Styling**: Tailwind CSS
- ✏️ **Rich Text**: TipTap editor
- 📷 **Image Processing**: Sharp
- 🧪 **Testing**: Vitest

## ✨ Current Features

### Core Infrastructure
- 🗄️ **Database Schema**: Complete multilingual content model
- 🔐 **Authentication**: Role-based admin system with Better Auth
- 📁 **Project Management**: Full CRUD with multilingual support
- 🖼️ **Image Processing**: Upload, resize, and thumbnail generation
- ✍️ **Content Management**: Rich text editor with TipTap
- 📬 **Contact System**: Form submission and admin management
- 📧 **Email Service**: SMTP integration for notifications

### Admin Features
- 🎛️ **Admin Dashboard**: Overview and navigation
- 🛠️ **Project Management**: Create, edit, delete projects with images
- 📄 **Content Pages**: Manage About, Services, and custom pages
- 💬 **Contact Messages**: View and manage form submissions
- ⚙️ **Email Settings**: Configure SMTP settings
- 👥 **User Management**: Admin authentication and sessions

### Public Features
- 🎨 **Portfolio Gallery**: Responsive project showcase
- 🔍 **Project Details**: Individual project pages with image carousels
- 📖 **Content Pages**: Dynamic About, Services, Contact pages
- 📝 **Contact Form**: GDPR-compliant contact submission
- 🌍 **Multilingual**: Dutch/French language support
- 🚀 **SEO Optimization**: Meta tags, sitemaps, structured data

## 🚧 In Progress

### Next Priority Features
- ⚡ **Gallery Management**: Admin interface for portfolio organization
- 📱 **Instagram Integration**: Automated post synchronization
- 🔒 **GDPR Compliance**: Cookie consent and privacy controls
- 🏎️ **Performance Optimization**: Image lazy loading and caching
- 🧪 **Testing Suite**: Comprehensive test coverage

## 📋 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API endpoints
│   ├── projects/          # Public portfolio pages
│   └── [slug]/            # Dynamic content pages
├── components/
│   ├── admin/             # Admin interface components
│   ├── gallery/           # Portfolio gallery components
│   ├── layout/            # Site layout components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and services
│   ├── auth-middleware.ts # Authentication logic
│   ├── content-service.ts # Content management
│   ├── project-service.ts # Project operations
│   └── image-processing.ts # Image handling
└── types/                 # TypeScript definitions
```

## 🗄️ Database Schema

### Core Models
- 👤 **Users**: Admin authentication and roles
- 🎨 **Projects**: Portfolio items with multilingual content
- 📄 **ContentPages**: Dynamic pages (About, Services, etc.)
- 💌 **ContactMessages**: Form submissions and management
- 🌐 **Languages**: Configurable language support
- ⚙️ **SiteSettings**: System configuration

### Multilingual Support
All content models support multiple languages with fallback handling:
- 🇳🇱 Dutch (default)
- 🇫🇷 French
- 🌍 Extensible for additional languages

## 🔧 Development Commands

```bash
# 🗄️ Database
npm run db:reset          # Reset and seed database
npm run db:seed           # Seed with sample data
npx prisma studio         # Database GUI

# 🚀 Development
npm run dev               # Start dev server
npm run build             # Production build
npm run test              # Run test suite
npm run test:watch        # Watch mode testing

# 👨‍💼 Admin Management
npx tsx scripts/reset-admin.ts    # Reset admin user
npx tsx scripts/check-content.ts  # Verify content data
```

## 📊 Progress Status

**Overall Progress: ~75% Complete**

### Completed Modules (100%)
- 💎 Database & Models
- 🛡️ Authentication System
- 📂 Project Management
- 📝 Content Management
- 🎭 Image Processing
- 📞 Contact System
- 🖼️ Public Portfolio
- 🎯 Admin Interface

### In Development (50-75%)
- 🎪 Gallery Management Interface
- 📮 Email Notifications
- 🔍 SEO Enhancements

### Planned (0-25%)
- 📸 Instagram Integration
- 🍪 GDPR Compliance
- ⚡ Performance Optimization
- 📊 Advanced Analytics

## 🎯 Next Steps

1. 🖼️ **Gallery Management**: Add admin interface for organizing portfolio
2. 📱 **Instagram Integration**: Automated social media synchronization
3. 🔒 **GDPR Features**: Cookie consent and privacy controls
4. ⚡ **Performance**: Optimize loading and caching
5. 🧪 **Testing**: Expand test coverage

## 📝 Configuration

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

### Admin Access
- 📧 **Email**: admin@nextjs-cms.com
- 🔑 **Password**: admin123
- 👑 **Role**: Full admin access

## 🤝 Contributing

This is a custom CMS built for small business needs. The codebase follows modern React/Next.js patterns with TypeScript for type safety.

## 📄 License

Private project - All rights reserved.
