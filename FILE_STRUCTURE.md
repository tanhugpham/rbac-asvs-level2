# Cấu Trúc Files - RBAC System ASVS Level 2

## 📁 Tổng Quan

```
rbac-asvs-level2/
├── 📄 Documentation Files (11 files)
├── 📁 prisma/ (Database)
├── 📁 src/ (Source Code)
├── ⚙️ Configuration Files
└── 🔒 Environment Files
```

---

## 📄 Documentation Files

### Báo Cáo & Tài Liệu Chính

| File | Mô Tả | Độ Quan Trọng |
|------|-------|---------------|
| `RBAC_ASVS_LEVEL2_REPORT.md` | Báo cáo chính thức đầy đủ (10+ pages) | ⭐⭐⭐ |
| `TEST_CASES.md` | 36 test cases chi tiết | ⭐⭐⭐ |
| `README.md` | Hướng dẫn tổng quan | ⭐⭐⭐ |
| `PROJECT_SUMMARY.md` | Tóm tắt dự án | ⭐⭐ |

### Hướng Dẫn

| File | Mô Tả | Độ Quan Trọng |
|------|-------|---------------|
| `SETUP_GUIDE.md` | Hướng dẫn cài đặt chi tiết | ⭐⭐⭐ |
| `DEMO_GUIDE.md` | Hướng dẫn demo cho sinh viên | ⭐⭐ |
| `INSTRUCTOR_GUIDE.md` | Hướng dẫn cho giảng viên | ⭐⭐ |
| `COMMANDS.md` | Tổng hợp lệnh hữu ích | ⭐ |

### Checklist & Utilities

| File | Mô Tả | Độ Quan Trọng |
|------|-------|---------------|
| `FINAL_CHECKLIST.md` | Checklist hoàn thành dự án | ⭐⭐ |
| `FILE_STRUCTURE.md` | File này - Cấu trúc dự án | ⭐ |

---

## 📁 prisma/ - Database

```
prisma/
├── schema.prisma          ⭐⭐⭐ Database schema với RBAC models
├── seed.ts                ⭐⭐⭐ Seed script (permissions, roles, users)
└── .gitkeep               Đảm bảo folder được track
```

### schema.prisma

**Mô tả**: Định nghĩa database schema với Prisma ORM

**Models**:
- `User` - Người dùng
- `Role` - Vai trò (ADMIN, STAFF, CUSTOMER)
- `Permission` - Quyền chi tiết
- `UserRole` - Many-to-many User-Role
- `RolePermission` - Many-to-many Role-Permission
- `AuditLog` - Logs bảo mật
- `Product` - Sản phẩm
- `Order` - Đơn hàng
- `OrderItem` - Chi tiết đơn hàng

**Quan trọng**: Đây là nền tảng của RBAC system

### seed.ts

**Mô tả**: Script khởi tạo dữ liệu mẫu

**Tạo**:
- 17 permissions
- 3 roles với permissions tương ứng
- 3 users mẫu (admin, staff, customer)
- Sample products

**Chạy**: `npm run prisma:seed`

---

## 📁 src/ - Source Code

### src/lib/ - Core Libraries ⭐⭐⭐

```
src/lib/
├── auth.ts                ⭐⭐⭐ Authorization core (QUAN TRỌNG NHẤT)
├── errors.ts              ⭐⭐⭐ Custom error classes
├── audit.ts               ⭐⭐ Audit logging
├── jwt.ts                 ⭐⭐ JWT utilities
├── password.ts            ⭐⭐ Password hashing
└── prisma.ts              ⭐ Prisma client singleton
```

#### auth.ts - Authorization Core

**Mô tả**: Lớp kiểm tra quyền tập trung - FILE QUAN TRỌNG NHẤT

**Functions**:
```typescript
getCurrentUser()                    // Lấy user hiện tại (cached)
getUserPermissions(userId)          // Lấy permissions của user
hasPermission(userId, permission)   // Kiểm tra permission
requireAuth()                       // Yêu cầu đăng nhập
requirePermission(permission)       // Yêu cầu permission cụ thể
requireAnyPermission(permissions)   // Yêu cầu một trong các permissions
requireOwnershipOrPermission()      // Kiểm tra ownership hoặc permission
hasRole(userId, roleName)           // Kiểm tra role
requireRole(roleName)               // Yêu cầu role cụ thể
```

**Đặc điểm**:
- Server-side enforcement
- Fail securely
- Cache trong request scope
- Throw proper errors (401, 403, 404)

#### errors.ts - Error Handling

**Mô tả**: Custom error classes tuân thủ ASVS Level 2

**Classes**:
```typescript
AppError                  // Base error class
UnauthorizedError         // 401 - Chưa đăng nhập
ForbiddenError            // 403 - Không đủ quyền
NotFoundError             // 404 - Không tìm thấy (che giấu tài nguyên)
ValidationError           // 400 - Dữ liệu không hợp lệ
ConflictError             // 409 - Tài nguyên đã tồn tại
```

**Function**:
```typescript
formatErrorResponse(error)  // Format error cho API response
```

**Đặc điểm**:
- Không trả stack trace ra client
- Generic error messages
- Proper HTTP status codes

#### audit.ts - Audit Logging

**Mô tả**: Ghi log các hành vi bảo mật

**Functions**:
```typescript
logAudit(data)                      // Ghi log chung
logAuthorizationFailure()           // Log khi bị từ chối
logSensitiveAction()                // Log hành động nhạy cảm
logLogin()                          // Log đăng nhập
```

**Lưu**:
- userId, action, resource, permission
- status (SUCCESS, DENIED, ERROR)
- IP address, user-agent
- timestamp

#### jwt.ts - JWT Utilities

**Mô tả**: Xử lý JWT tokens

**Functions**:
```typescript
signToken(payload)      // Tạo JWT token
verifyToken(token)      // Xác thực token
decodeToken(token)      // Giải mã token (không xác thực)
```

**Config**:
- Algorithm: HS256
- Expiry: 7 days
- Secret từ environment variable

#### password.ts - Password Security

**Mô tả**: Xử lý password hashing và validation

**Functions**:
```typescript
hashPassword(password)              // Hash với bcrypt
comparePassword(password, hash)     // So sánh password
validatePasswordStrength(password)  // Validate độ mạnh
```

**Requirements**:
- Ít nhất 8 ký tự
- Có chữ hoa, chữ thường, số, ký tự đặc biệt
- Bcrypt với 12 rounds

#### prisma.ts - Prisma Client

**Mô tả**: Prisma client singleton

**Đặc điểm**:
- Chỉ một instance trong development
- Tránh connection pool exhaustion

---

### src/types/ - TypeScript Types

```
src/types/
└── auth.ts                ⭐⭐⭐ Permission & role definitions
```

#### auth.ts - Type Definitions

**Mô tả**: Định nghĩa types, permissions, roles

**Exports**:
```typescript
// Types
JWTPayload
SessionUser
LoginCredentials
RegisterData
AuthResponse

// Constants
PERMISSIONS                 // 17 permissions
ROLES                       // 3 roles
ROLE_PERMISSIONS            // Ma trận Role-Permission
```

**Quan trọng**: Đây là single source of truth cho permissions

---

### src/app/api/ - API Routes

```
src/app/api/
├── auth/
│   ├── login/route.ts              POST /api/auth/login
│   ├── register/route.ts           POST /api/auth/register
│   ├── me/route.ts                 GET /api/auth/me
│   └── logout/route.ts             POST /api/auth/logout
├── users/
│   ├── route.ts                    GET /api/users (user:read)
│   └── [userId]/roles/route.ts     POST /api/users/:id/roles (user:update)
├── roles/
│   ├── route.ts                    GET /api/roles (role:read)
│   └── [roleId]/permissions/route.ts  POST /api/roles/:id/permissions (role:update)
├── permissions/route.ts            GET /api/permissions (role:read)
├── products/
│   ├── route.ts                    GET/POST /api/products
│   └── [productId]/route.ts        DELETE /api/products/:id (product:delete)
└── orders/
    ├── route.ts                    GET /api/orders (dynamic permission)
    └── [orderId]/route.ts          GET /api/orders/:id (ownership check)
```

**Đặc điểm chung**:
- Mọi route đều có authorization check
- Sử dụng `requirePermission()`, `requireAuth()`
- Format error với `formatErrorResponse()`
- Ghi audit log khi cần

**Ví dụ pattern**:
```typescript
export async function GET() {
  try {
    // Kiểm tra quyền
    await requirePermission(PERMISSIONS.USER_READ);
    
    // Business logic
    const users = await prisma.user.findMany();
    
    return NextResponse.json({ success: true, users });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
```

---

### src/app/ - Pages

```
src/app/
├── page.tsx                        Home page
├── layout.tsx                      Root layout
├── globals.css                     Global styles
├── login/page.tsx                  Login page
├── register/page.tsx               Register page
├── account/page.tsx                User account (protected)
├── products/page.tsx               Product listing
├── orders/
│   ├── page.tsx                    Order listing (protected)
│   └── [orderId]/page.tsx          Order detail (ownership check)
├── admin/
│   ├── users/page.tsx              User management (user:read)
│   ├── roles/page.tsx              Role management (role:read)
│   └── audit/page.tsx              Audit logs (audit:read)
└── 403/page.tsx                    Forbidden page
```

**Đặc điểm**:
- Server Components (Next.js 14)
- Authorization check ở server
- Redirect nếu không có quyền

**Ví dụ pattern**:
```typescript
export default async function AdminUsersPage() {
  // Kiểm tra quyền
  await requirePermission(PERMISSIONS.USER_READ);
  
  // Fetch data
  const users = await prisma.user.findMany();
  
  // Render
  return <div>...</div>;
}
```

---

### src/components/ - React Components

```
src/components/
├── RolePermissionManager.tsx       Quản lý permissions của role
└── UserRoleManager.tsx             Gán/xóa roles cho user
```

#### RolePermissionManager.tsx

**Mô tả**: Component để cập nhật permissions của role

**Props**:
- `roleId`: ID của role
- `roleName`: Tên role
- `currentPermissions`: Permissions hiện tại
- `allPermissions`: Tất cả permissions

**Features**:
- Checkbox để toggle permissions
- Save changes button
- Success/error messages

#### UserRoleManager.tsx

**Mô tả**: Component để gán/xóa roles cho user

**Props**:
- `userId`: ID của user
- `userEmail`: Email user
- `currentRoles`: Roles hiện tại
- `availableRoles`: Roles có thể gán

**Features**:
- Modal UI
- Assign/remove roles
- Success/error messages

---

### src/middleware.ts - Route Protection

**Mô tả**: Next.js middleware để bảo vệ routes

**Chức năng**:
- Kiểm tra authentication sơ bộ
- Redirect chưa đăng nhập về `/login`
- Redirect đã đăng nhập khỏi `/login`, `/register`

**Lưu ý**:
- Chỉ kiểm tra authentication, không kiểm tra permissions
- Permissions chi tiết kiểm tra trong page/API

---

## ⚙️ Configuration Files

```
├── package.json                    Dependencies & scripts
├── tsconfig.json                   TypeScript config (strict mode)
├── next.config.js                  Next.js config
├── .gitignore                      Git ignore rules
├── .env.example                    Environment template
└── .env                            Environment variables (NOT in git)
```

### package.json

**Dependencies chính**:
- `next`: ^14.2.0
- `react`: ^18.3.0
- `@prisma/client`: ^5.14.0
- `bcryptjs`: ^2.4.3
- `jsonwebtoken`: ^9.0.2
- `zod`: ^3.23.0

**Scripts**:
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "tsx prisma/seed.ts",
  "prisma:studio": "prisma studio",
  "db:reset": "prisma migrate reset --force"
}
```

### tsconfig.json

**Đặc điểm**:
- `"strict": true` - TypeScript strict mode
- Path aliases: `@/*` → `./src/*`

### .env.example

**Template cho environment variables**:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
ADMIN_EMAIL="..."
ADMIN_PASSWORD="..."
NODE_ENV="development"
```

---

## 🔒 Security Files

### .gitignore

**Ignore**:
- `node_modules/`
- `.env` (QUAN TRỌNG!)
- `.next/`
- `*.log`
- Database files

### .env

**Chứa**:
- DATABASE_URL
- JWT_SECRET
- Admin credentials

**CẢNH BÁO**: File này KHÔNG được commit vào git!

---

## 📊 File Statistics

| Category | Count | Lines of Code (est.) |
|----------|-------|---------------------|
| Documentation | 11 | ~5,000 |
| Source Code (TypeScript) | 30+ | ~3,000 |
| Database (Prisma) | 2 | ~400 |
| Configuration | 5 | ~200 |
| **TOTAL** | **48+** | **~8,600** |

---

## 🎯 Files Quan Trọng Nhất (Top 10)

1. **src/lib/auth.ts** ⭐⭐⭐
   - Authorization core
   - ~300 lines
   - Quan trọng nhất!

2. **src/types/auth.ts** ⭐⭐⭐
   - Permission definitions
   - Ma trận Role-Permission
   - Single source of truth

3. **prisma/schema.prisma** ⭐⭐⭐
   - Database schema
   - RBAC models
   - ~200 lines

4. **RBAC_ASVS_LEVEL2_REPORT.md** ⭐⭐⭐
   - Báo cáo chính thức
   - ~2,000 lines
   - Nộp cho giảng viên

5. **TEST_CASES.md** ⭐⭐⭐
   - 36 test cases
   - ~1,500 lines
   - Chứng minh bảo mật

6. **src/lib/errors.ts** ⭐⭐
   - Error handling
   - ASVS compliant
   - ~100 lines

7. **src/lib/audit.ts** ⭐⭐
   - Audit logging
   - Security events
   - ~150 lines

8. **prisma/seed.ts** ⭐⭐
   - Seed script
   - Initial data
   - ~200 lines

9. **README.md** ⭐⭐
   - Tổng quan dự án
   - Hướng dẫn cài đặt
   - ~500 lines

10. **src/app/api/orders/[orderId]/route.ts** ⭐⭐
    - Ownership check example
    - Horizontal access control
    - ~100 lines

---

## 📖 Đọc Files Theo Thứ Tự (Cho Người Mới)

### Bước 1: Hiểu Tổng Quan
1. `README.md` - Tổng quan dự án
2. `PROJECT_SUMMARY.md` - Tóm tắt
3. `RBAC_ASVS_LEVEL2_REPORT.md` - Báo cáo chi tiết

### Bước 2: Hiểu RBAC Model
1. `src/types/auth.ts` - Permissions & roles
2. `prisma/schema.prisma` - Database schema
3. `prisma/seed.ts` - Dữ liệu mẫu

### Bước 3: Hiểu Authorization
1. `src/lib/auth.ts` - Authorization core
2. `src/lib/errors.ts` - Error handling
3. `src/lib/audit.ts` - Audit logging

### Bước 4: Hiểu API Protection
1. `src/app/api/users/route.ts` - Vertical access control
2. `src/app/api/orders/[orderId]/route.ts` - Horizontal access control
3. `src/middleware.ts` - Route protection

### Bước 5: Hiểu UI
1. `src/app/admin/users/page.tsx` - Admin page
2. `src/components/UserRoleManager.tsx` - Component
3. `src/app/account/page.tsx` - User page

---

## 🔍 Tìm Kiếm Nhanh

### Tìm Authorization Logic
→ `src/lib/auth.ts`

### Tìm Permission Definitions
→ `src/types/auth.ts`

### Tìm Database Schema
→ `prisma/schema.prisma`

### Tìm API Routes
→ `src/app/api/`

### Tìm Test Cases
→ `TEST_CASES.md`

### Tìm Báo Cáo
→ `RBAC_ASVS_LEVEL2_REPORT.md`

### Tìm Hướng Dẫn Cài Đặt
→ `SETUP_GUIDE.md`

### Tìm Hướng Dẫn Demo
→ `DEMO_GUIDE.md`

---

## ✅ Checklist Files

Đảm bảo có đủ các files sau trước khi submit:

**Documentation (11 files)**
- [ ] RBAC_ASVS_LEVEL2_REPORT.md
- [ ] TEST_CASES.md
- [ ] README.md
- [ ] PROJECT_SUMMARY.md
- [ ] SETUP_GUIDE.md
- [ ] DEMO_GUIDE.md
- [ ] INSTRUCTOR_GUIDE.md
- [ ] COMMANDS.md
- [ ] FINAL_CHECKLIST.md
- [ ] FILE_STRUCTURE.md
- [ ] .env.example

**Source Code**
- [ ] src/lib/auth.ts
- [ ] src/types/auth.ts
- [ ] prisma/schema.prisma
- [ ] prisma/seed.ts
- [ ] All API routes
- [ ] All pages
- [ ] All components

**Configuration**
- [ ] package.json
- [ ] tsconfig.json
- [ ] next.config.js
- [ ] .gitignore

**NOT Included (Correct!)**
- [ ] .env (không commit!)
- [ ] node_modules/ (không commit!)
- [ ] .next/ (không commit!)

---

Tổng cộng: **48+ files** | **~8,600 lines of code** | **11 documentation files**
