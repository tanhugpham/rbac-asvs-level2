# 📚 PHẦN 1: TỔNG QUAN & CHUẨN BỊ

## 🎯 GIỚI THIỆU PROJECT

### Tên Project
**Interactive Security Demonstration Platform - RBAC OWASP ASVS Level 2**

### Mô tả ngắn gọn
Hệ thống quản lý phân quyền (Role-Based Access Control) tuân thủ chuẩn bảo mật OWASP ASVS Level 2, với giao diện visualization để demo các tính năng bảo mật real-time.

### Mục đích
- Quản lý user với 3 roles: ADMIN, STAFF, CUSTOMER
- Phân quyền chi tiết với 17 permissions
- Demo real-time cách hệ thống chặn attacks
- Tuân thủ chuẩn bảo mật quốc tế OWASP ASVS Level 2

---

## 💻 CÔNG NGHỆ SỬ DỤNG

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts và analytics

### Backend
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Security
- **OWASP ASVS Level 2** - Security standard
- **Server-side Authorization** - Không thể bypass
- **Audit Logging** - Ghi log mọi hành động

---

## ✨ TÍNH NĂNG CHÍNH

### 1. Authentication & Authorization ✅
- JWT-based authentication
- Cookie httpOnly, sameSite: lax
- Server-side authorization
- Multi-role support

### 2. RBAC System ✅
- **3 Roles**: ADMIN, STAFF, CUSTOMER
- **17 Permissions**: Chi tiết từng action
- **Role-Permission Matrix**: Rõ ràng, dễ quản lý
- **Ownership Validation**: User chỉ xem được own resources

### 3. Security Visualization ✅
- **RBAC Matrix** - Ma trận quyền hạn interactive
- **Authorization Flow** - Luồng xác thực 10 bước
- **Security Analytics** - Charts và metrics real-time
- **Live Attack Simulation** ⭐ - Demo tấn công real-time (HIGHLIGHT!)

### 4. Audit Logging ✅
- Ghi log mọi hành động
- Severity: LOW, MEDIUM, HIGH, CRITICAL
- Timestamp tracking
- Không lưu sensitive data

### 5. OWASP ASVS Level 2 Compliance ✅
- V4.1.1: Server-side access control
- V4.1.3: Principle of least privilege
- V4.1.5: Fail securely
- V7.1.1: No credentials in logs
- V8.3.4: Secure cookie attributes

---

## 👥 DEMO ACCOUNTS (GHI NHỚ!)

### ADMIN Account
```
Email: admin@example.com
Password: Admin@123456
Quyền: Full system access - Tất cả permissions
```

### STAFF Account
```
Email: staff@example.com
Password: Staff@123456
Quyền: Product & Order management only
```

### CUSTOMER Account
```
Email: an.customer@example.com
Password: Customer@123456
Quyền: Own resources only (chỉ xem được data của mình)
```

---

## 🚀 CHUẨN BỊ TRƯỚC KHI DEMO

### Bước 1: Kiểm tra môi trường

**Check Node.js**:
```bash
node --version
```
Cần: **v18.0.0 trở lên**

**Check npm**:
```bash
npm --version
```
Cần: **v9.0.0 trở lên**

**Check PostgreSQL**:
```bash
psql --version
```
Cần: **PostgreSQL 14 trở lên**

### Bước 2: Di chuyển vào thư mục project

```bash
cd C:\Users\Administrator\Downloads\BMUD
```

### Bước 3: Kiểm tra file .env

**Mở file `.env` và kiểm tra**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
```

⚠️ **LƯU Ý**: 
- `DATABASE_URL` phải đúng với database của bạn
- `JWT_SECRET` phải có (dùng để mã hóa JWT token)
- `NODE_ENV` để "development" khi demo

### Bước 4: Cài đặt dependencies (nếu chưa có)

```bash
npm install
```

Đợi đến khi thấy:
```
added XXX packages
```

### Bước 5: Setup database (nếu chưa có)

**Generate Prisma client**:
```bash
npx prisma generate
```

**Push schema to database**:
```bash
npx prisma db push
```

**Seed demo data** (tạo 3 demo accounts):
```bash
npx prisma db seed
```

Nếu thành công, sẽ thấy:
```
✓ Seeded 3 users
✓ Seeded 3 roles
✓ Seeded 17 permissions
```

### Bước 6: Start development server

```bash
npm run dev
```

**Đợi thấy**:
```
✓ Ready in XXXXms
- Local:        http://localhost:3000
- Environments: .env
```

⚠️ **QUAN TRỌNG**: Không tắt terminal này! Server phải chạy suốt khi demo.

### Bước 7: Test trước khi demo (BẮT BUỘC!)

**Mở browser mới** và test các bước sau:

#### Test 1: Login page
```
URL: http://localhost:3000/login
```
✅ Phải thấy trang login với 3 demo account cards

#### Test 2: Login ADMIN
```
1. Click vào card "Admin User"
2. Hoặc nhập: admin@example.com / Admin@123456
3. Click "Đăng nhập"
```
✅ Phải redirect về `/admin/dashboard`

#### Test 3: Attack Simulation
```
URL: http://localhost:3000/security/attack-simulation
```
✅ Phải thấy 6 attack scenarios bên trái
✅ Terminal display bên phải

#### Test 4: RBAC Matrix
```
URL: http://localhost:3000/security/rbac-matrix
```
✅ Phải thấy bảng matrix với roles và permissions

#### Test 5: Authorization Flow
```
URL: http://localhost:3000/security/flow
```
✅ Phải thấy 10-step flow diagram

#### Test 6: Security Analytics
```
URL: http://localhost:3000/security/analytics
```
✅ Phải thấy charts và metrics

### Bước 8: Clear browser data (QUAN TRỌNG!)

**Trước khi demo chính thức**:
```
1. Mở DevTools: F12
2. Application tab → Storage → Clear site data
3. Hoặc: Ctrl + Shift + Delete → Clear cookies
4. Close DevTools
5. Hard refresh: Ctrl + Shift + R
```

Lý do: Đảm bảo demo bắt đầu từ trang login, không bị cache.

---

## 📋 CHECKLIST TRƯỚC DEMO

### Môi trường
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] PostgreSQL running
- [ ] File .env configured

### Project
- [ ] Dependencies installed (`npm install`)
- [ ] Database seeded (`npx prisma db seed`)
- [ ] Server running (`npm run dev`)
- [ ] Server ready at http://localhost:3000

### Testing
- [ ] Login page works
- [ ] ADMIN login successful
- [ ] Attack Simulation page loads
- [ ] RBAC Matrix page loads
- [ ] Authorization Flow page loads
- [ ] Security Analytics page loads

### Browser
- [ ] Browser cookies cleared
- [ ] DevTools closed (hoặc ẩn)
- [ ] Browser zoom 100%
- [ ] Full screen mode (F11) - optional

### Chuẩn bị khác
- [ ] Đọc kỹ script demo (PART 2)
- [ ] Nhớ 3 demo accounts
- [ ] Chuẩn bị trả lời câu hỏi (PART 3)
- [ ] Laptop đầy pin hoặc cắm sạc
- [ ] Internet stable (nếu cần)

---

## 🎯 CẤU TRÚC DEMO (TỔNG QUAN)

### Thời gian: 15 phút

```
┌─────────────────────────────────────────────────┐
│ PHẦN 1: Giới thiệu (1 phút)                    │
│ - Giới thiệu project                            │
│ - Giới thiệu tính năng                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PHẦN 2: Live Attack Simulation (5 phút) ⭐      │
│ - Login ADMIN                                   │
│ - Run 2-3 attack scenarios                     │
│ - Giải thích OWASP ASVS                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PHẦN 3: Security Visualization (3 phút)        │
│ - RBAC Matrix                                   │
│ - Authorization Flow                            │
│ - Security Analytics                            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PHẦN 4: Demo STAFF & CUSTOMER (3 phút)         │
│ - Login STAFF → Try access admin → 403         │
│ - Login CUSTOMER → Try access admin → 403      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PHẦN 5: Giải thích OWASP ASVS (2 phút)         │
│ - V4.1.1, V4.1.3, V4.1.5, V7.1.1, V8.3.4       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PHẦN 6: Kết luận & Q&A (1 phút)                │
│ - Tóm tắt features                              │
│ - Trả lời câu hỏi                               │
└─────────────────────────────────────────────────┘
```

---

## 💡 TIPS QUAN TRỌNG

### Trước demo
1. ✅ **Test kỹ tất cả features** - Đừng để bị lỗi khi demo
2. ✅ **Đọc script nhiều lần** - Để nói tự nhiên, không đọc
3. ✅ **Nhớ 3 demo accounts** - Đừng phải nhìn giấy khi login
4. ✅ **Chuẩn bị backup plan** - Nếu server crash, làm gì?

### Trong demo
1. ✅ **Nói rõ ràng, tự tin** - Giọng to, rõ ràng
2. ✅ **Point màn hình** - Dùng chuột point vào phần đang giải thích
3. ✅ **Giải thích từng bước** - Đừng click quá nhanh
4. ✅ **Highlight điểm quan trọng** - "Đây!", "Các bạn thấy đây"

### Khi gặp lỗi
1. ✅ **Bình tĩnh** - Đừng hoảng
2. ✅ **Giải thích** - "Em sẽ refresh lại trang"
3. ✅ **Backup plan** - Chuyển sang demo phần khác trước
4. ✅ **Học từ lỗi** - Note lại để fix sau

---

## 🎬 SẴN SÀNG DEMO!

Sau khi hoàn thành tất cả các bước trên, bạn đã sẵn sàng!

**Tiếp theo**: Đọc **PART 2: KỊCH BẢN DEMO CHI TIẾT** để biết cách demo từng phần.

---

**Tạo bởi**: Nhóm RBAC Security
**Cập nhật**: May 18, 2026
**Version**: 1.0
