# 🛡️ RBAC Security System

**Role-Based Access Control System - OWASP ASVS Level 2 Compliant**

[![OWASP ASVS Level 2](https://img.shields.io/badge/OWASP%20ASVS-Level%202-blue)](https://owasp.org/www-project-application-security-verification-standard/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748)](https://www.prisma.io/)

---

## 📋 Overview

A professional RBAC system with enterprise-grade UI, permission visualization, and comprehensive security demonstrations. Built for OWASP ASVS Level 2 compliance.

### Key Features

- **🔐 JWT Authentication** with HTTP-only cookies
- **🛡️ RBAC** - 3 roles (ADMIN, STAFF, CUSTOMER), 17 permissions
- **✅ Server-side Authorization** - 100% server-side validation
- **📝 Audit Logging** - Track all security events
- **🎨 Enterprise UI** - Glassmorphism design, dark mode, animations
- **📊 Security Visualization** - RBAC matrix, authorization flow diagrams

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** 8+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd BMUD

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Cập nhật file `.env` với database URL và JWT secret của bạn:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db"
JWT_SECRET="your-super-secret-jwt-key"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed demo data (14 Vietnamese users, 6 products, sample orders)
npm run prisma:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👥 Demo Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **ADMIN** | admin@example.com | Admin@123456 | Full (16 permissions) |
| **STAFF** | staff@example.com | Staff@123456 | Limited (7 permissions) |
| **CUSTOMER** | an.customer@example.com | Customer@123456 | Minimal (2 permissions) |

---

## 🔧 Build & Deployment

Chi tiết về quy trình build, CI/CD, và các command hữu ích:

| Tài liệu | Mô tả |
|----------|-------|
| [📘 Setup Guide](./docs/SETUP_GUIDE.md) | Hướng dẫn cài đặt chi tiết (PostgreSQL, environment, troubleshooting) |
| [📗 Commands](./docs/COMMANDS.md) | Các command hữu ích cho development, build, deploy |
| [📙 CI/CD Pipeline](./docs/CI_CD_PIPELINE.md) | Pipeline CI/CD, deployment strategies |
| [📕 Security Report](./docs/RBAC_ASVS_LEVEL2_REPORT.md) | Báo cáo chi tiết về OWASP ASVS Level 2 compliance |

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Prisma ORM, PostgreSQL |
| **Security** | JWT + bcryptjs, Server-side RBAC, Audit Logging |
| **Testing** | OWASP ASVS Level 2 compliance |

---

## 📁 Project Structure

```
BMUD/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
├── src/
│   ├── app/                # Next.js App Router pages & API
│   │   ├── api/            # API routes (auth, users, roles, orders, products)
│   │   ├── dashboard/      # Role-based dashboards (admin, staff, customer)
│   │   ├── admin/          # Admin pages (security, users, roles, audit)
│   │   └── login/          # Login page
│   ├── components/         # React components
│   ├── lib/                # Core libraries (auth, jwt, audit, errors)
│   ├── types/              # TypeScript types & permission definitions
│   └── middleware.ts       # Next.js middleware (auth check)
├── docs/                   # Documentation
└── .env.example            # Environment template
```

---

## 📄 License

MIT - Dự án học tập cho môn Bảo mật Web và Ứng dụng.

---

**OWASP ASVS Level 2 Compliant** ✅ | Built with ❤️ using Next.js, Prisma, and Tailwind CSS