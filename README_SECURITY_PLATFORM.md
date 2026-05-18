# 🛡️ Interactive Security Demonstration Platform

## 📋 Overview

Hệ thống RBAC (Role-Based Access Control) tuân thủ **OWASP ASVS Level 2** với interactive security visualization, được thiết kế để demo đồ án một cách chuyên nghiệp và ấn tượng.

---

## ✨ Key Features

### 🔐 Security Features
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Cookie-based Sessions** - httpOnly, sameSite, secure
- ✅ **RBAC Enforcement** - Role-Based Access Control
- ✅ **Server-side Authorization** - All checks server-side
- ✅ **Ownership Validation** - Users can only access own resources
- ✅ **Audit Logging** - Complete audit trail
- ✅ **OWASP ASVS Level 2 Compliant** - Security best practices

### 📊 Visualization Features
- ✅ **RBAC Matrix** - Interactive permission matrix
- ✅ **Authorization Flow** - 10-step flow diagram
- ✅ **Security Analytics** - Real-time charts and metrics
- ✅ **Access Denied Display** - Beautiful 403 pages with explanations
- ✅ **Security Badges** - Visual security indicators

### 🎨 UI/UX Features
- ✅ **Dark Mode** - Cyber security style
- ✅ **Glassmorphism** - Modern glass effects
- ✅ **Animations** - Framer Motion animations
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Enterprise Dashboard** - Professional look

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Configure Environment
```bash
# .env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

### 4. Start Server
```bash
npm run dev
```

### 5. Open Browser
```
http://localhost:3000/login
```

---

## 👥 Demo Accounts

### ADMIN
```
Email: admin@example.com
Password: Admin@123456
Access: Full system access
```

### STAFF
```
Email: staff@example.com
Password: Staff@123456
Access: Product & Order management
```

### CUSTOMER
```
Email: an.customer@example.com
Password: Customer@123456
Access: Own resources only
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── dashboard/          # Admin dashboard
│   ├── staff/
│   │   └── dashboard/          # Staff dashboard
│   ├── account/                # Customer account
│   ├── security/               # Security visualization
│   │   ├── rbac-matrix/        # RBAC matrix page
│   │   ├── flow/               # Authorization flow
│   │   └── analytics/          # Security analytics
│   ├── login/                  # Login page
│   └── 403/                    # Access denied page
├── components/
│   ├── security/               # Security components
│   │   ├── RBACMatrix.tsx
│   │   ├── AuthorizationFlow.tsx
│   │   ├── SecurityAnalyticsDashboard.tsx
│   │   ├── AccessDeniedDisplay.tsx
│   │   └── SecurityBadge.tsx
│   ├── dashboards/             # Dashboard components
│   └── ui/                     # UI components
├── lib/
│   ├── auth.ts                 # Authentication logic
│   ├── jwt.ts                  # JWT utilities
│   ├── jwt-edge.ts             # JWT for Edge Runtime
│   ├── security-constants.ts  # Security constants
│   ├── security-analytics.ts  # Analytics helpers
│   └── prisma.ts               # Prisma client
├── types/
│   └── auth.ts                 # Type definitions
└── middleware.ts               # Route protection
```

---

## 🎯 Security Pages

### 1. RBAC Matrix
**URL**: `/security/rbac-matrix`
**Access**: ADMIN only
**Features**:
- Interactive permission matrix
- All roles vs all permissions
- Green checkmark = allowed
- Red X = denied
- Hover tooltips with descriptions
- OWASP ASVS compliance note

### 2. Authorization Flow
**URL**: `/security/flow`
**Access**: ADMIN only
**Features**:
- 10-step authorization flow
- Beautiful timeline visualization
- Icons for each step
- Detailed descriptions
- OWASP ASVS compliance mapping

### 3. Security Analytics
**URL**: `/security/analytics`
**Access**: ADMIN only
**Features**:
- Total requests counter
- Success vs Denied metrics
- Active users tracking
- Line chart: Requests by day
- Pie chart: Role distribution
- Bar chart: Top denied permissions
- Security score calculation

---

## 🔒 OWASP ASVS Level 2 Compliance

### V4.1.1: Access Control on Trusted Service Layer
✅ All authorization checks performed server-side
✅ Middleware as first layer
✅ API routes validate permissions
✅ Server components enforce access control

### V4.1.2: Protected User Attributes
✅ JWT token httpOnly
✅ Roles and permissions from database
✅ No sensitive data in client
✅ Secure cookie attributes

### V4.1.3: Principle of Least Privilege
✅ RBAC matrix with granular permissions
✅ Each role has minimum required permissions
✅ ADMIN: Full access
✅ STAFF: Product & Order management only
✅ CUSTOMER: Own resources only

### V4.1.5: Fail Securely
✅ Default deny if no permission
✅ Throw errors on unauthorized access
✅ Redirect to 403 with explanation
✅ Audit log all denied attempts

### V7.1.1: No Credentials in Logs
✅ Audit logs don't contain passwords
✅ No sensitive data logged
✅ Only action, user, timestamp, result

### V8.3.4: Secure Cookie Attributes
✅ httpOnly: true (prevent XSS)
✅ secure: true in production (HTTPS only)
✅ sameSite: 'lax' (CSRF protection)
✅ path: '/' (available everywhere)
✅ maxAge: 7 days

---

## 🎬 Demo Script

### 1. Introduction (1 min)
"Hệ thống RBAC tuân thủ OWASP ASVS Level 2 với interactive security visualization."

### 2. ADMIN Demo (3 min)
- Login as ADMIN
- Show RBAC Matrix
- Show Authorization Flow
- Show Security Analytics

### 3. STAFF Demo (2 min)
- Login as STAFF
- Try access RBAC Matrix → 403
- Show beautiful access denied page
- Explain RBAC enforcement

### 4. CUSTOMER Demo (2 min)
- Login as CUSTOMER
- Try access admin routes → 403
- Explain ownership validation

### 5. OWASP ASVS (2 min)
- Explain compliance
- Show security features
- Answer questions

**Total: 10 minutes**

---

## 📊 Technologies Used

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts and analytics
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Security
- **jsonwebtoken** - JWT signing/verification
- **jose** - Edge Runtime JWT
- **OWASP ASVS Level 2** - Security standard

---

## 🧪 Testing

### Test ADMIN Access
```bash
# Login as ADMIN
# Access: /security/rbac-matrix → ✅ Success
# Access: /security/flow → ✅ Success
# Access: /security/analytics → ✅ Success
```

### Test STAFF Access
```bash
# Login as STAFF
# Access: /staff/dashboard → ✅ Success
# Access: /security/rbac-matrix → ❌ 403
# Access: /admin/dashboard → ❌ 403
```

### Test CUSTOMER Access
```bash
# Login as CUSTOMER
# Access: /account → ✅ Success
# Access: /staff/dashboard → ❌ 403
# Access: /admin/dashboard → ❌ 403
```

---

## 📝 Documentation

### For Users
- `DEMO_QUICK_START.md` - Quick demo guide
- `README_SECURITY_PLATFORM.md` - This file

### For Developers
- `SECURITY_PLATFORM_ROADMAP.md` - Development roadmap
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `COOKIE_JWT_FIX.md` - Authentication fix details
- `STAFF_DASHBOARD_FIX.md` - Dashboard fix details
- `TEST_AUTH_NOW.md` - Authentication testing guide

---

## 🎯 Key Achievements

### Security
✅ OWASP ASVS Level 2 compliant
✅ Server-side authorization
✅ JWT authentication
✅ Audit logging
✅ Access control enforcement

### Visualization
✅ RBAC Matrix
✅ Authorization Flow
✅ Security Analytics
✅ Access Denied Display

### UI/UX
✅ Beautiful dark mode
✅ Smooth animations
✅ Responsive design
✅ Professional dashboard

### Code Quality
✅ TypeScript strict mode
✅ Clean architecture
✅ No hardcoded secrets
✅ Production-ready

---

## 🚀 Future Enhancements

### Phase 2 (Optional)
- [ ] User Management UI
- [ ] Role Management UI
- [ ] Audit Log Viewer
- [ ] Session Management
- [ ] AI Security Assistant
- [ ] Demo Mode with fake data

### Phase 3 (Optional)
- [ ] Real-time notifications
- [ ] Export reports (CSV/PDF)
- [ ] Advanced analytics
- [ ] Security score trends
- [ ] Threat detection

---

## 💡 Tips for Presentation

### Before Demo
1. Clear browser cookies
2. Server running
3. Database seeded
4. Demo accounts ready
5. Talking points prepared

### During Demo
1. Start with ADMIN - Show features
2. Switch to STAFF - Show access denied
3. Switch to CUSTOMER - Show ownership
4. Explain OWASP ASVS
5. Answer questions confidently

### Impressive Points
- Beautiful UI with animations
- Interactive visualizations
- Real-time analytics
- Comprehensive access control
- OWASP ASVS Level 2 compliant
- Enterprise-grade security
- Production-ready code

---

## 📞 Support

### Issues?
1. Check server is running: `npm run dev`
2. Check database is seeded: `npx prisma studio`
3. Check cookies: Clear browser cookies
4. Check logs: Server console logs
5. Check documentation: Read guides

### Questions?
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs

---

## 🎉 Conclusion

Hệ thống đã sẵn sàng để demo!

**Features**: ✅ Complete
**Security**: ✅ OWASP ASVS Level 2
**UI/UX**: ✅ Professional
**Code Quality**: ✅ Production-ready

**Good luck with your presentation!** 🚀

---

**Version**: 1.0.0
**Last Updated**: May 18, 2026
**Status**: Demo Ready ✅
