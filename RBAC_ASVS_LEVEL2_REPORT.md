# Báo Cáo Hệ Thống Phân Quyền RBAC - OWASP ASVS Level 2

## 1. Mục Tiêu Đề Tài

Xây dựng hệ thống phân quyền Role-Based Access Control (RBAC) đạt chuẩn OWASP Application Security Verification Standard (ASVS) Level 2 cho ứng dụng web digital account shop.

### Mục tiêu cụ thể:
- Kiểm soát truy cập dựa trên vai trò và quyền chi tiết
- Ngăn chặn truy cập trái phép theo chiều dọc (vertical privilege escalation)
- Ngăn chặn truy cập trái phép theo chiều ngang (horizontal privilege escalation)
- Fail securely - từ chối mặc định khi thiếu quyền
- Ghi log đầy đủ các hành vi bảo mật
- Không để lộ thông tin nhạy cảm trong error messages

---

## 2. Mô Hình RBAC

### 2.1. Các Thành Phần

```
User (Người dùng)
  ↓ (Many-to-Many)
UserRole (Bảng trung gian)
  ↓
Role (Vai trò: ADMIN, STAFF, CUSTOMER)
  ↓ (Many-to-Many)
RolePermission (Bảng trung gian)
  ↓
Permission (Quyền chi tiết: user:read, product:create, etc.)
```

### 2.2. Giải Thích

- **User**: Người dùng hệ thống
- **Role**: Vai trò nghiệp vụ (ADMIN, STAFF, CUSTOMER)
- **Permission**: Quyền chi tiết theo format `resource:action`
- **UserRole**: Một user có thể có nhiều role
- **RolePermission**: Một role có thể có nhiều permission

---

## 3. Ma Trận Quyền Hạn

### 3.1. Danh Sách Permissions

| Permission | Mô Tả |
|-----------|-------|
| `user:read` | Xem danh sách và thông tin users |
| `user:create` | Tạo user mới |
| `user:update` | Cập nhật thông tin user |
| `user:delete` | Xóa user |
| `role:read` | Xem danh sách roles và permissions |
| `role:create` | Tạo role mới |
| `role:update` | Cập nhật role và gán permissions |
| `role:delete` | Xóa role |
| `product:read` | Xem danh sách sản phẩm |
| `product:create` | Tạo sản phẩm mới |
| `product:update` | Cập nhật sản phẩm |
| `product:delete` | Xóa sản phẩm |
| `order:read` | Xem tất cả đơn hàng (admin/staff) |
| `order:manage` | Quản lý đơn hàng (cập nhật status) |
| `order:read_own` | Xem đơn hàng của chính mình |
| `account:read_secret` | Xem thông tin tài khoản sau khi mua |
| `audit:read` | Xem audit logs |

### 3.2. Ma Trận Role-Permission

| Permission | ADMIN | STAFF | CUSTOMER |
|-----------|-------|-------|----------|
| user:read | ✅ | ✅ | ❌ |
| user:create | ✅ | ❌ | ❌ |
| user:update | ✅ | ❌ | ❌ |
| user:delete | ✅ | ❌ | ❌ |
| role:read | ✅ | ❌ | ❌ |
| role:create | ✅ | ❌ | ❌ |
| role:update | ✅ | ❌ | ❌ |
| role:delete | ✅ | ❌ | ❌ |
| product:read | ✅ | ✅ | ✅ |
| product:create | ✅ | ✅ | ❌ |
| product:update | ✅ | ✅ | ❌ |
| product:delete | ✅ | ✅ | ❌ |
| order:read | ✅ | ✅ | ❌ |
| order:manage | ✅ | ✅ | ❌ |
| order:read_own | ❌ | ❌ | ✅ |
| account:read_secret | ✅ | ✅ | ❌ |
| audit:read | ✅ | ❌ | ❌ |

### 3.3. Giải Thích Vai Trò

**ADMIN (Administrator)**
- Toàn quyền quản trị hệ thống
- Quản lý users, roles, permissions
- Xem audit logs
- Quản lý sản phẩm và đơn hàng

**STAFF (Nhân viên)**
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng (xem tất cả, cập nhật status)
- Xem thông tin account sau khi khách mua
- Không quản lý roles/permissions

**CUSTOMER (Khách hàng)**
- Xem sản phẩm
- Xem đơn hàng của chính mình
- Không xem được account secret (chỉ chủ order mới xem được)

---

## 4. Kiến Trúc Kiểm Soát Truy Cập

### 4.1. Luồng Authentication & Authorization

```
1. User đăng nhập → Xác thực email/password
2. Tạo JWT token → Lưu vào HTTP-only cookie
3. Mỗi request → Middleware kiểm tra token
4. Server Action/API → Kiểm tra permissions chi tiết
5. Truy cập tài nguyên → Kiểm tra ownership hoặc permission
6. Log audit → Ghi nhận hành vi
```

### 4.2. Các Lớp Bảo Vệ

**Layer 1: Middleware (Route-level)**
- Kiểm tra authentication sơ bộ
- Redirect chưa đăng nhập về /login
- Không kiểm tra permissions chi tiết

**Layer 2: Server Actions/API Routes (Permission-level)**
- Kiểm tra permissions cụ thể
- Sử dụng `requirePermission()`, `requireAuth()`
- Throw 401/403 nếu không đủ quyền

**Layer 3: Resource-level (Ownership)**
- Kiểm tra ownership của tài nguyên
- Sử dụng `requireOwnershipOrPermission()`
- Throw 404 để che giấu tài nguyên không thuộc về user

### 4.3. Core Authorization Functions

```typescript
// Yêu cầu đăng nhập
await requireAuth()

// Yêu cầu permission cụ thể
await requirePermission(PERMISSIONS.USER_READ)

// Yêu cầu một trong các permissions
await requireAnyPermission([PERMISSIONS.ORDER_READ, PERMISSIONS.ORDER_MANAGE])

// Yêu cầu ownership hoặc permission
await requireOwnershipOrPermission(resourceOwnerId, PERMISSIONS.ORDER_READ)
```

---

## 5. Tuân Thủ OWASP ASVS Level 2

### 5.1. V4: Access Control

| ID | Yêu Cầu ASVS | Triển Khai |
|----|-------------|-----------|
| 4.1.1 | Enforce least privilege | ✅ Mỗi role chỉ có permissions cần thiết |
| 4.1.2 | Access control fail securely | ✅ Mặc định từ chối, throw error nếu thiếu quyền |
| 4.1.3 | Deny by default | ✅ Không có permission = không có quyền |
| 4.1.5 | Access controls fail securely | ✅ Lỗi trong kiểm tra quyền → từ chối truy cập |
| 4.2.1 | Sensitive data access logging | ✅ Ghi log mọi lần truy cập bị từ chối |
| 4.2.2 | Sensitive operations logging | ✅ Log thay đổi role, permission |

### 5.2. V4.1: General Access Control Design

**✅ Principle of Least Privilege**
- CUSTOMER chỉ có quyền xem sản phẩm và order của mình
- STAFF không quản lý roles/permissions
- ADMIN có toàn quyền nhưng mọi hành động đều được log

**✅ Fail Securely**
```typescript
// Nếu không có session → null
const user = await getCurrentUser();
if (!user) throw new UnauthorizedError();

// Nếu không có permission → throw error
if (!user.permissions.includes(permission)) {
  throw new ForbiddenError();
}
```

**✅ Deny by Default**
- Không có permission trong danh sách → không có quyền
- Không có role → không có permission
- Token không hợp lệ → không có session

### 5.3. V4.2: Operation Level Access Control

**✅ Server-side Enforcement**
- Mọi kiểm tra quyền thực hiện ở server
- Không tin dữ liệu từ client
- UI chỉ ẩn/hiện nút, không phải lớp bảo mật chính

**✅ Vertical Access Control**
```typescript
// CUSTOMER không thể gọi API admin
await requirePermission(PERMISSIONS.USER_READ); // → 403 nếu là CUSTOMER
```

**✅ Horizontal Access Control**
```typescript
// User A không xem được order của User B
await requireOwnershipOrPermission(order.userId, PERMISSIONS.ORDER_READ);
// → 404 nếu không phải owner và không có quyền
```

### 5.4. V7: Error Handling and Logging

**✅ Không Để Lộ Thông Tin Nhạy Cảm**
```typescript
// Không trả stack trace ra client
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return { error: { message: error.message, code: error.code } };
  }
  // Lỗi không xác định → generic message
  return { error: { message: 'An unexpected error occurred' } };
}
```

**✅ Audit Logging**
- Ghi log mọi lần bị từ chối truy cập
- Ghi log các hành động nhạy cảm (thay đổi role, permission)
- Lưu userId, action, resource, permission, IP, user-agent, timestamp

### 5.5. V2: Authentication

**✅ Password Security**
- Bcrypt với salt rounds = 12
- Validate password strength (8+ chars, uppercase, lowercase, number, special char)
- Không lưu plaintext password

**✅ Session Management**
- JWT với HTTP-only cookie
- Secure flag trong production
- SameSite=lax để chống CSRF
- Token expiry: 7 days

---

## 6. Các Lỗi Authorization Đã Xử Lý

### 6.1. Vertical Privilege Escalation

**Vấn đề**: User thường cố gọi API admin

**Giải pháp**:
```typescript
// API /api/users - chỉ admin/staff
await requirePermission(PERMISSIONS.USER_READ);
// → CUSTOMER gọi → 403 Forbidden
```

**Test case**: CUSTOMER gọi `GET /api/users` → 403

### 6.2. Horizontal Privilege Escalation

**Vấn đề**: User A cố xem order của User B

**Giải pháp**:
```typescript
await requireOwnershipOrPermission(order.userId, PERMISSIONS.ORDER_READ, true);
// throwNotFound=true → trả 404 thay vì 403 để che giấu tài nguyên
```

**Test case**: Customer A gọi `GET /api/orders/{order_of_customer_B}` → 404

### 6.3. Insecure Direct Object Reference (IDOR)

**Vấn đề**: Thay đổi ID trong URL để truy cập tài nguyên khác

**Giải pháp**:
- Kiểm tra ownership trước khi trả dữ liệu
- Trả 404 nếu không phải owner (che giấu sự tồn tại)

### 6.4. Client-side Bypass

**Vấn đề**: User sửa permission ở client/devtools

**Giải pháp**:
- Permissions lưu ở server, không tin client
- Mỗi API call đều query database để lấy permissions mới nhất
- Cache trong request scope, không cache cross-request

### 6.5. Missing Function Level Access Control

**Vấn đề**: API không kiểm tra quyền, chỉ dựa vào UI ẩn nút

**Giải pháp**:
- Mọi API/server action đều có `requirePermission()` ở đầu
- UI chỉ là UX enhancement, không phải security layer

---

## 7. Bảng Test Cases

### 7.1. Authentication Tests

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-AUTH-01 | Đăng nhập với email/password đúng | 200, set cookie, redirect /account |
| TC-AUTH-02 | Đăng nhập với password sai | 401, error message |
| TC-AUTH-03 | Đăng nhập với email không tồn tại | 401, error message |
| TC-AUTH-04 | Đăng ký với password yếu | 400, validation errors |
| TC-AUTH-05 | Đăng ký với email đã tồn tại | 409, conflict error |
| TC-AUTH-06 | Truy cập /account không đăng nhập | Redirect /login |
| TC-AUTH-07 | Logout | Clear cookie, redirect / |

### 7.2. Authorization Tests - Vertical Privilege Escalation

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-AUTHZ-01 | CUSTOMER gọi GET /api/users | 403 Forbidden |
| TC-AUTHZ-02 | CUSTOMER gọi GET /api/roles | 403 Forbidden |
| TC-AUTHZ-03 | CUSTOMER gọi POST /api/products | 403 Forbidden |
| TC-AUTHZ-04 | STAFF gọi GET /api/users | 200 Success |
| TC-AUTHZ-05 | STAFF gọi POST /api/roles/{id}/permissions | 403 Forbidden |
| TC-AUTHZ-06 | ADMIN gọi GET /api/users | 200 Success |
| TC-AUTHZ-07 | ADMIN gọi POST /api/roles/{id}/permissions | 200 Success |

### 7.3. Authorization Tests - Horizontal Privilege Escalation

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-AUTHZ-08 | Customer A xem order của Customer B | 404 Not Found |
| TC-AUTHZ-09 | Customer A xem order của chính mình | 200 Success |
| TC-AUTHZ-10 | ADMIN xem order của bất kỳ ai | 200 Success |
| TC-AUTHZ-11 | STAFF xem order của bất kỳ ai | 200 Success |

### 7.4. Resource-level Authorization Tests

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-AUTHZ-12 | Customer xem account secret trong order của mình | 200, hiển thị secret |
| TC-AUTHZ-13 | Customer không có account:read_secret xem order khác | 404 hoặc [REDACTED] |
| TC-AUTHZ-14 | STAFF có account:read_secret xem mọi order | 200, hiển thị secret |

### 7.5. Audit Logging Tests

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-AUDIT-01 | CUSTOMER gọi API không có quyền | Log ACCESS_DENIED với userId, resource, permission |
| TC-AUDIT-02 | ADMIN thay đổi role của user | Log ROLE_ASSIGNED với details |
| TC-AUDIT-03 | ADMIN cập nhật permissions của role | Log PERMISSION_GRANTED với details |
| TC-AUDIT-04 | User đăng nhập thành công | Log LOGIN với status SUCCESS |
| TC-AUDIT-05 | User đăng nhập thất bại | Log LOGIN với status DENIED |

### 7.6. Security Tests

| Test Case | Mô Tả | Kết Quả Mong Đợi |
|-----------|-------|------------------|
| TC-SEC-01 | Gọi API với token không hợp lệ | 401 Unauthorized |
| TC-SEC-02 | Gọi API với token hết hạn | 401 Unauthorized |
| TC-SEC-03 | Sửa permission ở client devtools | Server vẫn kiểm tra từ database, không bị bypass |
| TC-SEC-04 | Gọi API trực tiếp bằng curl/Postman | Vẫn bị kiểm tra quyền đầy đủ |
| TC-SEC-05 | Lỗi server không trả stack trace | Response chỉ có generic error message |

---

## 8. Kết Quả Kiểm Thử

### 8.1. Phương Pháp Kiểm Thử

**Manual Testing**
- Đăng nhập với các role khác nhau
- Thử truy cập các API/route không có quyền
- Kiểm tra response codes và error messages
- Xác minh audit logs được ghi đúng

**API Testing với Postman/curl**
- Gọi API với token hợp lệ/không hợp lệ
- Thử bypass authorization bằng cách sửa request
- Kiểm tra IDOR vulnerabilities

**Code Review**
- Xác minh mọi API đều có authorization check
- Kiểm tra không có hardcoded secrets
- Xác minh error handling không leak information

### 8.2. Kết Quả

✅ **Tất cả test cases đều PASS**

- Không có vertical privilege escalation
- Không có horizontal privilege escalation
- Không có IDOR vulnerabilities
- Audit logs ghi đầy đủ
- Error messages không leak information
- Fail securely trong mọi trường hợp

---

## 9. Hướng Phát Triển Thêm

### 9.1. Tính Năng Bổ Sung

**Rate Limiting**
- Giới hạn số lần đăng nhập thất bại
- Giới hạn số request API per user

**Two-Factor Authentication (2FA)**
- Tăng cường bảo mật cho admin accounts
- TOTP hoặc SMS OTP

**Permission Inheritance**
- Role hierarchy (ADMIN > STAFF > CUSTOMER)
- Inherited permissions

**Dynamic Permissions**
- Permissions dựa trên context (time, location, etc.)
- Temporary permissions

**API Key Authentication**
- Cho third-party integrations
- Scoped API keys với permissions riêng

### 9.2. Cải Thiện Performance

**Caching**
- Cache user permissions trong Redis
- Invalidate cache khi role/permission thay đổi

**Database Optimization**
- Index trên các foreign keys
- Optimize permission lookup queries

### 9.3. Monitoring & Alerting

**Real-time Alerts**
- Alert khi có nhiều lần truy cập bị từ chối từ cùng IP
- Alert khi có thay đổi permissions của admin

**Dashboard**
- Thống kê số lần truy cập bị từ chối
- Top users bị từ chối nhiều nhất
- Heatmap của các hành động nhạy cảm

---

## 10. Kết Luận

Hệ thống RBAC đã được xây dựng tuân thủ đầy đủ các yêu cầu của OWASP ASVS Level 2 về Access Control:

✅ **Least Privilege**: Mỗi role chỉ có quyền cần thiết
✅ **Fail Securely**: Mặc định từ chối khi thiếu quyền
✅ **Server-side Enforcement**: Mọi kiểm tra quyền ở server
✅ **Audit Logging**: Ghi log đầy đủ các hành vi bảo mật
✅ **No Information Leakage**: Error messages không để lộ thông tin nhạy cảm
✅ **Vertical & Horizontal Access Control**: Ngăn chặn cả hai loại privilege escalation

Hệ thống đã được kiểm thử kỹ lưỡng và sẵn sàng cho môi trường production với các best practices về bảo mật.

---

## Phụ Lục

### A. Cấu Trúc Thư Mục

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── users/         # User management APIs
│   │   │   ├── roles/         # Role management APIs
│   │   │   ├── orders/        # Order APIs
│   │   │   └── products/      # Product APIs
│   │   ├── admin/             # Admin pages
│   │   ├── account/           # User account page
│   │   └── orders/            # Order pages
│   ├── lib/
│   │   ├── auth.ts            # Authorization core
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── password.ts        # Password hashing
│   │   ├── audit.ts           # Audit logging
│   │   ├── errors.ts          # Custom errors
│   │   └── prisma.ts          # Prisma client
│   ├── types/
│   │   └── auth.ts            # TypeScript types
│   └── components/            # React components
├── .env.example               # Environment variables template
└── RBAC_ASVS_LEVEL2_REPORT.md # Báo cáo này
```

### B. Biến Môi Trường

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123456"
```

### C. Lệnh Chạy Dự Án

```bash
# Cài đặt dependencies
npm install

# Tạo database và chạy migrations
npx prisma migrate dev

# Seed dữ liệu mẫu
npm run prisma:seed

# Chạy development server
npm run dev
```

---

**Người thực hiện**: [Tên sinh viên]  
**Lớp**: [Tên lớp]  
**Môn học**: Bảo mật web và ứng dụng  
**Ngày hoàn thành**: [Ngày]
