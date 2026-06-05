# 📚 HƯỚNG DẪN DEMO PROJECT CHO NHÓM

## 🎯 GIỚI THIỆU

Đây là tài liệu hướng dẫn chi tiết để các thành viên trong nhóm có thể demo project một cách chuyên nghiệp và tự tin.

**Tên Project**: Interactive Security Demonstration Platform - RBAC OWASP ASVS Level 2

**Mục đích**: Hệ thống quản lý phân quyền (Role-Based Access Control) tuân thủ chuẩn bảo mật OWASP ASVS Level 2, với giao diện visualization để demo các tính năng bảo mật real-time.

---

## 📋 THÔNG TIN PROJECT

### Công nghệ sử dụng
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Security**: JWT, bcryptjs, OWASP ASVS Level 2
- **Visualization**: Recharts, Terminal UI, Animations

### Tính năng chính
1. ✅ Authentication & Authorization (JWT-based)
2. ✅ RBAC System (3 roles, 17 permissions)
3. ✅ Security Visualization (4 pages)
4. ✅ Live Attack Simulation ⭐ (Feature highlight!)
5. ✅ Audit Logging
6. ✅ OWASP ASVS Level 2 Compliance

---

## 🚀 CHUẨN BỊ TRƯỚC KHI DEMO

### Bước 1: Kiểm tra môi trường

**Check Node.js**:
```bash
node --version
# Cần: v18 trở lên
```

**Check npm**:
```bash
npm --version
# Cần: v9 trở lên
```

### Bước 2: Clone và setup project

```bash
# Di chuyển vào thư mục project
cd C:\Users\Administrator\Downloads\BMUD

# Kiểm tra file .env tồn tại
# File .env phải có:
# DATABASE_URL="postgresql://..."
# JWT_SECRET="your-secret-key"
# NODE_ENV="development"
```

### Bước 3: Cài đặt dependencies (nếu chưa có)

```bash
npm install
```

### Bước 4: Setup database (nếu chưa có)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npx prisma db seed
```

### Bước 5: Start server

```bash
npm run dev
```

**Đợi thấy**:
```
✓ Ready in XXXXms
Local: http://localhost:3000
```

### Bước 6: Test trước khi demo

1. Mở browser: `http://localhost:3000/login`
2. Login với ADMIN: `admin@example.com` / `Admin@123456`
3. Check các pages hoạt động:
   - `/admin/dashboard` ✅
   - `/security/attack-simulation` ✅
   - `/security/rbac-matrix` ✅
   - `/security/flow` ✅
   - `/security/analytics` ✅

---

## 👥 DEMO ACCOUNTS

**Ghi nhớ 3 accounts này**:

```
┌─────────────────────────────────────────────────────┐
│ ADMIN                                               │
│ Email: admin@example.com                            │
│ Password: Admin@123456                              │
│ Access: Full system access                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STAFF                                               │
│ Email: staff@example.com                            │
│ Password: Staff@123456                              │
│ Access: Product & Order management only             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CUSTOMER                                            │
│ Email: an.customer@example.com                      │
│ Password: Customer@123456                           │
│ Access: Own resources only                          │
└─────────────────────────────────────────────────────┘
```

---

## 🎬 KỊCH BẢN DEMO CHI TIẾT (15 PHÚT)

### ⏱️ PHẦN 1: GIỚI THIỆU (1 phút)

**Script**:
```
"Xin chào thầy/cô và các bạn. Nhóm em xin phép demo đồ án:
'Interactive Security Demonstration Platform - RBAC OWASP ASVS Level 2'

Đây là hệ thống quản lý phân quyền với 3 roles: ADMIN, STAFF, CUSTOMER.
Mỗi role có quyền hạn khác nhau.

Điểm đặc biệt của hệ thống là có tính năng Live Attack Simulation
để visualize real-time cách hệ thống chặn các cuộc tấn công trái phép.

Em sẽ demo theo thứ tự:
1. Live Attack Simulation (feature highlight)
2. RBAC Matrix
3. Authorization Flow
4. Security Analytics
5. Demo với các roles khác nhau

Bắt đầu ạ."
```

---

### ⏱️ PHẦN 2: LIVE ATTACK SIMULATION (5 phút) ⭐

**Đây là phần QUAN TRỌNG NHẤT!**

#### Bước 1: Login ADMIN
```
1. Mở: http://localhost:3000/login
2. Click vào card "Admin User" (màu đỏ)
3. Hoặc nhập: admin@example.com / Admin@123456
4. Click "Đăng nhập"
```

**Script khi login**:
```
"Em login với ADMIN account để có full access."
```

#### Bước 2: Vào Attack Simulation
```
URL: http://localhost:3000/security/attack-simulation
```

**Script**:
```
"Đây là trang Live Attack Simulation.
Bên trái là 6 attack scenarios với severity khác nhau.
Bên phải là terminal để hiển thị real-time attack flow."
```

#### Bước 3: Run Scenario 1 - Customer → Admin Dashboard

**Thao tác**:
```
1. Click vào card "Customer → Admin Dashboard" (màu đỏ, HIGH severity)
2. Đợi animation chạy (mỗi step 600ms)
3. Quan sát terminal output
```

**Script khi animation chạy**:
```
"Em sẽ mô phỏng: CUSTOMER cố truy cập Admin Dashboard.

[Khi step 1-2 xuất hiện]
'Bước 1-2: Request đi qua Middleware, kiểm tra authentication → Pass'

[Khi step 3-4 xuất hiện]
'Bước 3-4: Load user session từ database → Pass'

[Khi step 5 xuất hiện - BLOCKED]
'Bước 5: Authorization kiểm tra permission audit:read → BLOCKED!'

[Point to màn hình]
'Đây! Attack bị chặn tại Authorization Layer.
CUSTOMER không có permission audit:read.

Các bạn thấy hệ thống tự động:
- Ghi audit log với severity HIGH
- Redirect về trang 403
- Hiển thị explanation đầy đủ

[Point to OWASP ASVS references]
Tuân thủ OWASP ASVS:
- V4.1.1: Server-side access control
- V4.1.3: Least privilege
- V4.1.5: Fail securely
- V7.1.1: Security event logged'
```

#### Bước 4: Run Scenario 2 - Staff → Modify Admin Role

**Thao tác**:
```
1. Click "Reset" button
2. Click vào card "Staff → Modify Admin Role" (màu đỏ, CRITICAL)
3. Đợi animation
```

**Script**:
```
"Scenario nghiêm trọng hơn: STAFF cố sửa role của ADMIN.
Đây là CRITICAL severity attack.

[Khi animation chạy đến blocked step]
'Blocked tại API Authorization Layer.
STAFF không có permission role:update.

Đây là ví dụ về principle of least privilege:
STAFF chỉ có quyền quản lý products và orders,
không có quyền quản lý roles hay permissions.

Hệ thống tạo CRITICAL audit log và return 403 Forbidden.'"
```

