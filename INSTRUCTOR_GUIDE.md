# Hướng Dẫn Cho Giảng Viên - RBAC System ASVS Level 2

## 📌 Tổng Quan Nhanh

Đây là dự án xây dựng hệ thống phân quyền RBAC (Role-Based Access Control) tuân thủ OWASP ASVS Level 2 cho môn Bảo mật web và ứng dụng.

**Tech Stack**: Next.js 14 + TypeScript + Prisma + PostgreSQL + JWT

**Thời gian setup**: ~10 phút

**Thời gian review**: ~15-20 phút

---

## 🚀 Quick Start (Cho Giảng Viên)

### Bước 1: Cài Đặt (5 phút)

```bash
# Clone/extract project
cd rbac-asvs-level2

# Install dependencies
npm install

# Setup database (cần PostgreSQL đang chạy)
# Cập nhật DATABASE_URL trong .env nếu cần
npx prisma migrate dev

# Seed dữ liệu mẫu
npm run prisma:seed

# Chạy server
npm run dev
```

### Bước 2: Test Accounts

Mở http://localhost:3000 và đăng nhập với:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@example.com | Admin@123456 |
| STAFF | staff@example.com | Staff@123456 |
| CUSTOMER | customer@example.com | Customer@123456 |

---

## 📋 Điểm Đánh Giá Chính

### 1. Yêu Cầu Chức Năng (30%)

**✅ Ma trận quyền hạn RBAC**
- Xem: `RBAC_ASVS_LEVEL2_REPORT.md` → Section 3
- Code: `src/types/auth.ts` → `ROLE_PERMISSIONS`
- 3 roles, 17 permissions, ma trận đầy đủ

**✅ Cơ chế kiểm tra quyền tập trung**
- Code: `src/lib/auth.ts`
- Functions: `requireAuth()`, `requirePermission()`, `requireOwnershipOrPermission()`
- Server-side enforcement

**✅ Giao diện quản lý**
- `/admin/users` - Quản lý users và roles
- `/admin/roles` - Quản lý permissions
- `/admin/audit` - Xem logs

### 2. Bảo Mật (40%)

**✅ OWASP ASVS Level 2 Compliance**
- Xem: `RBAC_ASVS_LEVEL2_REPORT.md` → Section 5
- V4: Access Control ✅
- V7: Error Handling ✅
- V2: Authentication ✅

**✅ Ngăn chặn Vertical Privilege Escalation**
- Test: Customer gọi `GET /api/users` → 403
- Code: `src/app/api/users/route.ts` → `requirePermission()`

**✅ Ngăn chặn Horizontal Privilege Escalation**
- Test: Customer A xem order của Customer B → 404
- Code: `src/app/api/orders/[orderId]/route.ts` → ownership check

**✅ Audit Logging**
- Code: `src/lib/audit.ts`
- Database: `audit_logs` table
- UI: `/admin/audit`

**✅ Error Handling**
- Code: `src/lib/errors.ts`
- Không leak information
- Proper HTTP status codes

### 3. Code Quality (20%)

**✅ TypeScript Strict**
- `tsconfig.json` → `"strict": true`
- Type safety throughout

**✅ Clean Code**
- Comments ở các đoạn quan trọng
- Consistent naming
- Separation of concerns

**✅ No Hardcoded Secrets**
- `.env.example` có template
- `.env` trong `.gitignore`
- Environment variables

### 4. Documentation (10%)

**✅ Báo cáo chính thức**
- `RBAC_ASVS_LEVEL2_REPORT.md` - 10+ pages
- Đầy đủ: mục tiêu, kiến trúc, test cases, ASVS compliance

**✅ Test Cases**
- `TEST_CASES.md` - 36 test cases
- Steps, expected results, actual results

**✅ README & Guides**
- `README.md` - Tổng quan
- `SETUP_GUIDE.md` - Hướng dẫn cài đặt
- `DEMO_GUIDE.md` - Hướng dẫn demo

---

## 🧪 Test Scenarios (Đánh Giá Nhanh)

### Test 1: Authentication (2 phút)

```bash
# 1. Đăng nhập thành công
→ http://localhost:3000/login
→ admin@example.com / Admin@123456
→ Redirect về /account ✅

# 2. Đăng nhập thất bại
→ Password sai → Error message ✅
→ Không leak information ✅
```

### Test 2: Vertical Privilege Escalation (3 phút)

```bash
# 1. Login với customer@example.com
# 2. Thử truy cập /admin/users
→ Bị chặn ✅

# 3. Thử gọi API trực tiếp
curl http://localhost:3000/api/users -b cookies.txt
→ 403 Forbidden ✅

# 4. Kiểm tra audit log (login với admin)
→ /admin/audit
→ Có log ACCESS_DENIED ✅
```

### Test 3: Horizontal Privilege Escalation (3 phút)

```bash
# 1. Login với customer A
# 2. Vào /orders → Lấy order ID
# 3. Login với customer B (browser khác)
# 4. Thử truy cập /orders/{order_id_of_A}
→ 404 Not Found (không phải 403) ✅

# 5. Login với admin/staff
# 6. Truy cập order của bất kỳ ai
→ 200 Success ✅
```

### Test 4: Admin Functions (2 phút)

```bash
# 1. Login với admin
# 2. Vào /admin/users
→ Xem danh sách users ✅
→ Gán role cho user ✅

# 3. Vào /admin/roles
→ Xem permissions của roles ✅
→ Cập nhật permissions ✅
```

### Test 5: API Security (2 phút)

```bash
# Dùng Postman/curl

# 1. Không có token
curl http://localhost:3000/api/users
→ 401 Unauthorized ✅

# 2. Token của customer
curl http://localhost:3000/api/users -b customer_cookies.txt
→ 403 Forbidden ✅

# 3. Token của admin
curl http://localhost:3000/api/users -b admin_cookies.txt
→ 200 Success ✅
```

---

## 📊 Rubric Đề Xuất

| Tiêu Chí | Điểm | Ghi Chú |
|----------|------|---------|
| **Chức Năng (30%)** | | |
| Ma trận RBAC đầy đủ | 10 | 3 roles, 17 permissions |
| Cơ chế kiểm tra quyền | 10 | Server-side, tập trung |
| Giao diện quản lý | 10 | Admin pages hoàn chỉnh |
| **Bảo Mật (40%)** | | |
| ASVS Level 2 compliance | 10 | V4, V7, V2 |
| Vertical access control | 10 | Ngăn chặn privilege escalation |
| Horizontal access control | 10 | Ownership check |
| Audit logging | 5 | Ghi log đầy đủ |
| Error handling | 5 | Không leak info |
| **Code Quality (20%)** | | |
| TypeScript strict | 5 | Type safety |
| Clean code | 5 | Comments, naming |
| No hardcoded secrets | 5 | Environment variables |
| Architecture | 5 | Separation of concerns |
| **Documentation (10%)** | | |
| Báo cáo chính thức | 5 | RBAC_ASVS_LEVEL2_REPORT.md |
| Test cases | 3 | TEST_CASES.md |
| README & guides | 2 | Đầy đủ, rõ ràng |
| **TỔNG** | **100** | |

---

## 🔍 Điểm Cần Kiểm Tra

### Critical Security Checks

1. **Server-side Enforcement**
   - [ ] Mọi API route có authorization check
   - [ ] Không tin dữ liệu từ client
   - [ ] UI ẩn nút nhưng server vẫn kiểm tra

2. **Fail Securely**
   - [ ] Mặc định từ chối khi thiếu quyền
   - [ ] Lỗi trong kiểm tra → từ chối
   - [ ] Không có permission → không có quyền

3. **No Information Leakage**
   - [ ] Error messages generic
   - [ ] Không trả stack trace
   - [ ] Dùng 404 thay vì 403 khi cần

4. **Audit Logging**
   - [ ] Log access denied
   - [ ] Log sensitive actions
   - [ ] Include userId, IP, timestamp

### Code Quality Checks

1. **TypeScript**
   - [ ] Strict mode enabled
   - [ ] No `any` types (trừ khi cần thiết)
   - [ ] Proper type definitions

2. **Security**
   - [ ] No hardcoded secrets
   - [ ] `.env` trong `.gitignore`
   - [ ] Password hashing với bcrypt
   - [ ] JWT với HTTP-only cookies

3. **Database**
   - [ ] Prisma schema đầy đủ
   - [ ] Migrations chạy được
   - [ ] Seed script hoạt động

---

## 📁 Files Quan Trọng Cần Review

### 1. Core Authorization (Quan trọng nhất)

```
src/lib/auth.ts          ⭐⭐⭐ - Authorization core
src/types/auth.ts        ⭐⭐⭐ - Permission definitions
src/lib/errors.ts        ⭐⭐ - Error handling
src/lib/audit.ts         ⭐⭐ - Audit logging
```

### 2. API Routes (Kiểm tra authorization)

```
src/app/api/users/route.ts                    - User management
src/app/api/orders/[orderId]/route.ts         - Ownership check
src/app/api/roles/[roleId]/permissions/route.ts - Role management
```

### 3. Database

```
prisma/schema.prisma     ⭐⭐⭐ - Database schema
prisma/seed.ts           ⭐⭐ - Seed script
```

### 4. Documentation

```
RBAC_ASVS_LEVEL2_REPORT.md  ⭐⭐⭐ - Báo cáo chính
TEST_CASES.md               ⭐⭐ - Test cases
README.md                   ⭐ - Tổng quan
```

---

## 💡 Câu Hỏi Gợi Ý Khi Chấm

### Về RBAC

1. "Em giải thích mô hình RBAC trong hệ thống?"
   - **Đáp án tốt**: User → Role → Permission, many-to-many

2. "Tại sao dùng RBAC thay vì ACL?"
   - **Đáp án tốt**: Dễ quản lý, scalable, phù hợp với business roles

### Về Bảo Mật

3. "Làm sao đảm bảo customer không xem được order của người khác?"
   - **Đáp án tốt**: `requireOwnershipOrPermission()`, kiểm tra `order.userId === user.id`

4. "Nếu admin thay đổi permission, user đang đăng nhập có bị ảnh hưởng ngay không?"
   - **Đáp án tốt**: Có, vì mỗi request query database để lấy permissions mới nhất

5. "Tại sao trả về 404 thay vì 403?"
   - **Đáp án tốt**: Để che giấu sự tồn tại của tài nguyên, tránh information leakage

### Về Implementation

6. "Em implement JWT như thế nào?"
   - **Đáp án tốt**: HTTP-only cookie, secure flag, SameSite=lax, token expiry

7. "Làm sao ngăn chặn SQL injection?"
   - **Đáp án tốt**: Dùng Prisma ORM, tự động parameterize queries

8. "Audit log lưu những gì?"
   - **Đáp án tốt**: userId, action, resource, permission, status, IP, user-agent, timestamp

---

## 🎯 Điểm Cộng (Bonus)

- [ ] Automated tests (Jest/Vitest)
- [ ] API documentation (Swagger)
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Rate limiting
- [ ] 2FA implementation
- [ ] Permission caching với Redis

---

## ⚠️ Red Flags (Cần Lưu Ý)

- ❌ Hardcoded passwords/secrets trong code
- ❌ `.env` bị commit vào git
- ❌ Không có authorization check trong API
- ❌ Chỉ dựa vào UI để ẩn nút (không kiểm tra server)
- ❌ Trả stack trace ra client
- ❌ Không có audit logging
- ❌ Password không được hash
- ❌ SQL injection vulnerabilities

---

## 📞 Support

Nếu có vấn đề khi chạy dự án:

1. **Database connection error**
   - Kiểm tra PostgreSQL đang chạy: `pg_isready`
   - Kiểm tra DATABASE_URL trong `.env`

2. **Prisma errors**
   - Chạy: `npx prisma generate`
   - Chạy: `npx prisma migrate dev`

3. **Port 3000 already in use**
   - Chạy: `PORT=3001 npm run dev`

4. **Reset database**
   - Chạy: `npm run db:reset`

---

## ✅ Checklist Đánh Giá Nhanh

- [ ] Dự án chạy được (`npm run dev`)
- [ ] Đăng nhập được với 3 accounts
- [ ] Customer không truy cập được admin pages
- [ ] Customer không xem được order của người khác
- [ ] Admin quản lý được users và roles
- [ ] Audit logs ghi đầy đủ
- [ ] API được bảo vệ đúng
- [ ] Error handling không leak info
- [ ] Code quality tốt
- [ ] Documentation đầy đủ

---

**Thời gian đánh giá đề xuất**: 20-30 phút

**Điểm đề xuất**: Dựa trên rubric trên (tổng 100 điểm)

---

Chúc giảng viên đánh giá thuận lợi! 🎓
