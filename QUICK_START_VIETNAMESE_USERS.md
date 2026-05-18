# 🚀 Quick Start - Vietnamese Fake Users

## Chạy Nhanh (5 phút)

### Bước 1: Generate Prisma Client

```bash
npx prisma generate
```

**Kết quả mong đợi**:
```
✔ Generated Prisma Client
```

---

### Bước 2: Push Schema lên Database

```bash
npx prisma db push
```

**Kết quả mong đợi**:
```
✔ Database synchronized with Prisma schema
```

**Hoặc** tạo migration (khuyến nghị):

```bash
npx prisma migrate dev --name add_vietnamese_users
```

---

### Bước 3: Seed Fake Users Tiếng Việt

```bash
npm run prisma:seed
```

**Hoặc**:

```bash
npx prisma db seed
```

**Kết quả mong đợi**:

```
🌱 Starting seed with Vietnamese fake users...
📝 Creating permissions...
✅ Created 17 permissions
👥 Creating roles...
✅ Created 3 roles
🔗 Assigning permissions to roles...
✅ Assigned permissions to roles
👥 Creating Vietnamese fake users...
✅ Created 14 Vietnamese fake users
📦 Creating Vietnamese sample products...
✅ Created Vietnamese sample products

🎉 Seed completed successfully!

================================================================================
📋 DANH SÁCH TÀI KHOẢN DEMO (VIETNAMESE FAKE USERS)
================================================================================

👑 ADMIN (Quản trị viên):
   • Nguyễn Minh Quân          | admin@example.com                   | Admin@123456

👔 STAFF (Nhân viên):
   • Trần Quốc Bảo             | staff@example.com                   | Staff@123456
   • Lê Thị Mai Anh            | maianh.staff@example.com            | Staff@123456
   • Phạm Hoàng Nam            | hoangnam.staff@example.com          | Staff@123456

👤 CUSTOMER (Khách hàng):
   • Nguyễn Văn An             | an.customer@example.com             | Customer@123456
   • Trần Thị Bích Ngọc        | bichngoc.customer@example.com       | Customer@123456
   • Lê Minh Khang             | khang.customer@example.com          | Customer@123456
   • Phạm Gia Huy              | giahuy.customer@example.com         | Customer@123456
   • Hoàng Thanh Tâm           | thanhtam.customer@example.com       | Customer@123456
   • Đỗ Hải Đăng               | haidang.customer@example.com        | Customer@123456
   • Vũ Phương Linh            | phuonglinh.customer@example.com     | Customer@123456
   • Bùi Nhật Minh             | nhatminh.customer@example.com       | Customer@123456
   • Đặng Khánh Vy             | khanhvy.customer@example.com        | Customer@123456
   • Nguyễn Tuấn Kiệt          | tuankiet.customer@example.com       | Customer@123456

================================================================================
💡 LƯU Ý:
   - Tất cả mật khẩu đã được hash bằng bcryptjs
   - Dữ liệu này chỉ dùng cho demo, không dùng trong production
   - Email sử dụng domain giả @example.com
================================================================================

✅ Bạn có thể đăng nhập với bất kỳ tài khoản nào ở trên!
```

---

### Bước 4: Chạy Development Server

```bash
npm run dev
```

**Kết quả mong đợi**:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## ✅ Test Ngay

### 1. Mở Trình Duyệt

```
http://localhost:3000
```

### 2. Đăng Nhập với Admin

```
Email:    admin@example.com
Password: Admin@123456
```

→ Bạn sẽ thấy trang account với đầy đủ quyền admin

### 3. Test Các Tính Năng

- ✅ Vào `/admin/users` - Xem 14 users tiếng Việt
- ✅ Vào `/admin/roles` - Quản lý roles và permissions
- ✅ Vào `/products` - Xem 6 sản phẩm tiếng Việt
- ✅ Vào `/admin/audit` - Xem audit logs

### 4. Test với Staff

```
Logout → Login với:
Email:    maianh.staff@example.com
Password: Staff@123456
```

→ Có quyền quản lý sản phẩm, KHÔNG có quyền quản lý roles

### 5. Test với Customer

```
Logout → Login với:
Email:    khang.customer@example.com
Password: Customer@123456
```

→ Chỉ xem được sản phẩm và orders của mình

---

## 🎯 Tất Cả Trong Một Lệnh

Nếu bạn muốn chạy tất cả cùng lúc:

```bash
npx prisma generate && npx prisma db push && npm run prisma:seed && npm run dev
```

---

## 🔄 Reset Database (Nếu Cần)

Nếu muốn xóa tất cả dữ liệu và seed lại:

```bash
npx prisma migrate reset
```

Lệnh này sẽ:
1. Xóa tất cả dữ liệu
2. Chạy lại migrations
3. Tự động chạy seed script

---

## 📊 Kiểm Tra Database

### Dùng Prisma Studio (GUI)

```bash
npm run prisma:studio
```

Mở trình duyệt tại: http://localhost:5555

Bạn sẽ thấy:
- ✅ 14 users với tên tiếng Việt
- ✅ 3 roles (ADMIN, STAFF, CUSTOMER)
- ✅ 17 permissions
- ✅ 6 products tiếng Việt

### Dùng psql (Command Line)

```bash
psql -U postgres -d rbac_db

-- Xem tất cả users
SELECT name, email FROM users;

-- Xem users với roles
SELECT u.name, u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id
ORDER BY r.name, u.name;

-- Thoát
\q
```

---

## 🎉 Xong!

Bây giờ bạn có:
- ✅ 14 fake users tiếng Việt
- ✅ 6 sản phẩm tiếng Việt
- ✅ Hệ thống RBAC hoàn chỉnh
- ✅ Sẵn sàng demo!

---

## 📚 Tài Liệu Chi Tiết

- `VIETNAMESE_USERS_GUIDE.md` - Hướng dẫn đầy đủ về fake users
- `README.md` - Tổng quan dự án
- `DEMO_GUIDE.md` - Hướng dẫn demo
- `TEST_CASES.md` - Test cases

---

**💡 Tip**: Copy danh sách tài khoản từ output của seed script để dễ dàng test!
