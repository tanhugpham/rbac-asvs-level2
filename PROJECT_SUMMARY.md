# Tóm Tắt Dự Án - Hệ Thống RBAC ASVS Level 2

## 📌 Thông Tin Dự Án

**Tên đề tài**: Xây dựng hệ thống phân quyền RBAC đạt chuẩn OWASP ASVS Level 2

**Môn học**: Bảo mật web và ứng dụng

**Mục tiêu**: Xây dựng hệ thống kiểm soát truy cập dựa trên vai trò (RBAC) tuân thủ các yêu cầu bảo mật của OWASP ASVS Level 2

---

## 🎯 Các Yêu Cầu Đã Hoàn Thành

### 1. ✅ Ma Trận Quyền Hạn RBAC

**3 Roles:**
- ADMIN: Toàn quyền quản trị
- STAFF: Quản lý sản phẩm và đơn hàng
- CUSTOMER: Xem sản phẩm và đơn hàng của mình

**17 Permissions:**
- User management: `user:read`, `user:create`, `user:update`, `user:delete`
- Role management: `role:read`, `role:create`, `role:update`, `role:delete`
- Product management: `product:read`, `product:create`, `product:update`, `product:delete`
- Order management: `order:read`, `order:manage`, `order:read_own`
- Special: `account:read_secret`, `audit:read`

### 2. ✅ Cơ Chế Kiểm Tra Quyền Tập Trung

**Core Functions** (trong `src/lib/auth.ts`):
```typescript
- getCurrentUser()                    // Lấy user hiện tại
- requireAuth()                       // Yêu cầu đăng nhập
- requirePermission(permission)       // Yêu cầu permission cụ thể
- requireAnyPermission(permissions)   // Yêu cầu một trong các permissions
- requireOwnershipOrPermission()      // Kiểm tra ownership hoặc permission
```

**Đặc điểm:**
- Tất cả kiểm tra quyền ở server-side
- Cache trong request scope
- Fail securely - mặc định từ chối

### 3. ✅ Kiểm Soát Lỗi Trong Cơ Chế Ủy Quyền

**Custom Error Classes:**
- `UnauthorizedError` (401): Chưa đăng nhập
- `ForbiddenError` (403): Không đủ quyền
- `NotFoundError` (404): Che giấu tài nguyên
- `ValidationError` (400): Dữ liệu không hợp lệ
- `ConflictError` (409): Tài nguyên đã tồn tại

**Error Handling:**
- Không trả stack trace ra client
- Generic error messages
- Proper HTTP status codes

### 4. ✅ Giao Diện Quản Lý

**Admin Pages:**
- `/admin/users` - Quản lý users và gán roles
- `/admin/roles` - Quản lý roles và permissions
- `/admin/audit` - Xem audit logs

**User Pages:**
- `/account` - Thông tin tài khoản và permissions
- `/products` - Danh sách sản phẩm
- `/orders` - Danh sách đơn hàng
- `/orders/[id]` - Chi tiết đơn hàng

**Features:**
- UI ẩn/hiện nút theo permissions (UX)
- Server vẫn kiểm tra quyền đầy đủ (Security)
- Responsive design

### 5. ✅ Báo Cáo Kiểm Thử

**36 Test Cases** được documented trong `TEST_CASES.md`:
- 7 Authentication tests
- 7 Vertical privilege escalation tests
- 4 Horizontal privilege escalation tests
- 3 Resource-level authorization tests
- 5 Audit logging tests
- 5 Security tests
- 5 Error handling tests

**Kết quả**: 36/36 PASS ✅

---

## 🔐 Tuân Thủ OWASP ASVS Level 2

### V4.1: General Access Control Design

✅ **4.1.1** - Least Privilege: Mỗi role chỉ có permissions cần thiết

✅ **4.1.2** - Fail Securely: Mặc định từ chối khi thiếu quyền

✅ **4.1.3** - Deny by Default: Không có permission = không có quyền

✅ **4.1.5** - Secure Failure: Lỗi trong kiểm tra → từ chối truy cập

### V4.2: Operation Level Access Control

✅ **4.2.1** - Server-side Enforcement: Mọi kiểm tra quyền ở server

✅ **4.2.2** - Vertical Access Control: Ngăn chặn privilege escalation

✅ **4.2.3** - Horizontal Access Control: Kiểm tra ownership

### V7: Error Handling and Logging

✅ **7.1.1** - No Information Leakage: Error messages không để lộ thông tin

✅ **7.1.2** - Audit Logging: Ghi log đầy đủ các sự kiện bảo mật

### V2: Authentication

✅ **2.1.1** - Password Storage: Bcrypt với 12 rounds

✅ **2.1.2** - Password Strength: Validate 8+ chars, uppercase, lowercase, number, special

✅ **2.2.1** - Session Management: JWT với HTTP-only cookies

---

## 🏗️ Kiến Trúc Hệ Thống

### Tech Stack

```
Frontend:  Next.js 14 (App Router) + React + TypeScript
Backend:   Next.js API Routes + Server Actions
Database:  PostgreSQL
ORM:       Prisma
Auth:      JWT + bcrypt
```

### Database Schema

```
User ←→ UserRole ←→ Role ←→ RolePermission ←→ Permission
  ↓
Order ←→ OrderItem ←→ Product
  ↓
AuditLog
```

### Security Layers

```
Layer 1: Middleware
  ↓ (Route-level authentication check)
Layer 2: Server Actions/API Routes
  ↓ (Permission-level authorization)
Layer 3: Resource Access
  ↓ (Ownership validation)
Database
```

---

## 📁 Cấu Trúc Files

```
rbac-asvs-level2/
├── prisma/
│   ├── schema.prisma          # Database schema với RBAC models
│   └── seed.ts                # Seed permissions, roles, users
├── src/
│   ├── app/
│   │   ├── api/               # Protected API routes
│   │   ├── admin/             # Admin pages (role:read, user:read)
│   │   ├── account/           # User account page
│   │   ├── orders/            # Order pages (ownership check)
│   │   └── products/          # Product listing
│   ├── lib/
│   │   ├── auth.ts            # ⭐ Authorization core
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── password.ts        # Password hashing
│   │   ├── audit.ts           # Audit logging
│   │   ├── errors.ts          # Custom error classes
│   │   └── prisma.ts          # Prisma client
│   ├── types/
│   │   └── auth.ts            # ⭐ Permissions & roles definition
│   ├── components/            # React components
│   └── middleware.ts          # Route protection
├── .env.example               # Environment template
├── README.md                  # Hướng dẫn tổng quan
├── SETUP_GUIDE.md             # Hướng dẫn cài đặt chi tiết
├── RBAC_ASVS_LEVEL2_REPORT.md # ⭐ Báo cáo chính thức
├── TEST_CASES.md              # ⭐ Test cases chi tiết
└── PROJECT_SUMMARY.md         # File này
```

**⭐ Files quan trọng nhất:**
1. `src/lib/auth.ts` - Core authorization logic
2. `src/types/auth.ts` - Permission definitions
3. `RBAC_ASVS_LEVEL2_REPORT.md` - Báo cáo đầy đủ
4. `TEST_CASES.md` - Test cases và kết quả

---

## 🚀 Cách Chạy Dự Án

### Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Cấu hình .env
cp .env.example .env
# Cập nhật DATABASE_URL và JWT_SECRET

# 3. Tạo database
createdb rbac_db

# 4. Chạy migrations
npx prisma migrate dev

# 5. Seed dữ liệu
npm run prisma:seed

# 6. Chạy dev server
npm run dev
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@example.com | Admin@123456 |
| STAFF | staff@example.com | Staff@123456 |
| CUSTOMER | customer@example.com | Customer@123456 |

---

## 🧪 Kịch Bản Test Nhanh

### Test 1: Vertical Privilege Escalation

```bash
1. Đăng nhập với customer@example.com
2. Thử truy cập /admin/users
   → Kết quả: Bị chặn, redirect hoặc 403
3. Thử gọi GET /api/users
   → Kết quả: 403 Forbidden
4. Kiểm tra /admin/audit
   → Kết quả: Log ACCESS_DENIED được ghi
```

### Test 2: Horizontal Privilege Escalation

```bash
1. Đăng nhập với customer@example.com (Customer A)
2. Tạo order cho Customer A
3. Lấy order ID
4. Đăng nhập với customer khác (Customer B)
5. Thử truy cập /orders/{order_id_of_A}
   → Kết quả: 404 Not Found (che giấu tài nguyên)
6. Kiểm tra /admin/audit (với admin)
   → Kết quả: Log ACCESS_DENIED được ghi
```

### Test 3: Permission Check

```bash
1. Đăng nhập với staff@example.com
2. Vào /admin/users
   → Kết quả: Thành công (có user:read)
3. Vào /admin/roles
   → Kết quả: 403 (không có role:read)
4. Thử cập nhật permissions của role
   → Kết quả: 403 (không có role:update)
```

---

## 📊 Điểm Nổi Bật

### 1. Security Best Practices

✅ **Server-side Authorization**
- Mọi kiểm tra quyền ở server
- Không tin dữ liệu từ client
- UI chỉ là UX enhancement

✅ **Fail Securely**
```typescript
const user = await getCurrentUser();
if (!user) throw new UnauthorizedError(); // Mặc định từ chối

if (!user.permissions.includes(permission)) {
  throw new ForbiddenError(); // Không có quyền = từ chối
}
```

✅ **Audit Logging**
- Log mọi lần bị từ chối
- Log các hành động nhạy cảm
- Include userId, IP, user-agent, timestamp

✅ **Error Handling**
- Không leak information
- Proper HTTP status codes
- Generic error messages

### 2. Code Quality

✅ **TypeScript Strict Mode**
- Type safety
- Compile-time error checking

✅ **Clean Architecture**
- Separation of concerns
- Reusable authorization functions
- Single responsibility principle

✅ **Documentation**
- Inline comments cho logic phức tạp
- README và guides chi tiết
- Test cases documented

### 3. OWASP ASVS Compliance

✅ **Level 2 Requirements**
- V4: Access Control ✅
- V7: Error Handling ✅
- V2: Authentication ✅

---

## 🎓 Kiến Thức Áp Dụng

### Bảo Mật

1. **RBAC (Role-Based Access Control)**
   - User → Role → Permission
   - Many-to-many relationships
   - Least privilege principle

2. **OWASP ASVS Level 2**
   - Access control requirements
   - Error handling requirements
   - Authentication requirements

3. **Common Vulnerabilities**
   - Vertical privilege escalation
   - Horizontal privilege escalation
   - IDOR (Insecure Direct Object Reference)
   - Information leakage

### Công Nghệ

1. **Next.js 14**
   - App Router
   - Server Actions
   - Middleware

2. **Prisma ORM**
   - Schema definition
   - Migrations
   - Type-safe queries

3. **JWT Authentication**
   - Token generation
   - Token validation
   - HTTP-only cookies

4. **PostgreSQL**
   - Relational database
   - Foreign keys
   - Indexes

---

## 📈 Hướng Phát Triển

### Tính Năng Bổ Sung

1. **Rate Limiting**
   - Giới hạn login attempts
   - API rate limiting

2. **Two-Factor Authentication**
   - TOTP
   - SMS OTP

3. **Permission Inheritance**
   - Role hierarchy
   - Inherited permissions

4. **Dynamic Permissions**
   - Context-based permissions
   - Temporary permissions

### Performance

1. **Caching**
   - Redis cache cho permissions
   - Cache invalidation

2. **Database Optimization**
   - Query optimization
   - Connection pooling

### Monitoring

1. **Real-time Alerts**
   - Multiple access denied from same IP
   - Admin permission changes

2. **Dashboard**
   - Access denied statistics
   - User activity heatmap

---

## 📚 Tài Liệu Tham Khảo

1. **OWASP ASVS**
   - https://owasp.org/www-project-application-security-verification-standard/

2. **Next.js Documentation**
   - https://nextjs.org/docs

3. **Prisma Documentation**
   - https://www.prisma.io/docs

4. **JWT Best Practices**
   - https://tools.ietf.org/html/rfc8725

---

## ✅ Checklist Hoàn Thành

### Yêu Cầu Đề Tài

- [x] Ma trận quyền hạn RBAC
- [x] Cơ chế kiểm tra quyền tập trung ở server-side
- [x] Kiểm soát lỗi trong cơ chế ủy quyền
- [x] Giao diện quản lý vai trò, quyền và người dùng
- [x] Báo cáo kiểm thử ngăn chặn truy cập trái phép

### Yêu Cầu Bảo Mật

- [x] Áp dụng nguyên tắc Least Privilege
- [x] Mọi kiểm tra quyền ở server-side
- [x] API/server action kiểm tra quyền
- [x] Cấm truy cập trái phép theo chiều dọc
- [x] Cấm truy cập trái phép theo chiều ngang
- [x] Fail securely
- [x] Không để lộ thông tin nhạy cảm trong lỗi
- [x] Ghi log các lần bị từ chối truy cập
- [x] Không hardcode secret

### Code Quality

- [x] TypeScript strict
- [x] Code rõ ràng, có comment
- [x] .env.example
- [x] .gitignore đầy đủ
- [x] README và documentation

---

## 🎉 Kết Luận

Dự án đã hoàn thành đầy đủ các yêu cầu:

✅ **Chức năng**: RBAC hoàn chỉnh với 3 roles, 17 permissions

✅ **Bảo mật**: Tuân thủ OWASP ASVS Level 2

✅ **Kiểm thử**: 36/36 test cases PASS

✅ **Documentation**: Đầy đủ và chi tiết

✅ **Code Quality**: TypeScript strict, clean code

Hệ thống sẵn sàng cho việc demo và bảo vệ đồ án!

---

**Người thực hiện**: [Tên sinh viên]  
**Lớp**: [Tên lớp]  
**Môn học**: Bảo mật web và ứng dụng  
**Ngày hoàn thành**: [Ngày]
