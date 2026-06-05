# 🚀 CHẠY NGAY - Fake Users Tiếng Việt

## ⚡ Quick Commands (Copy & Paste)

### 1️⃣ Generate Prisma Client

```bash
npx prisma generate
```

### 2️⃣ Push Schema to Database

```bash
npx prisma db push
```

### 3️⃣ Seed Vietnamese Fake Users

```bash
npm run prisma:seed
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

## 🎯 Hoặc Chạy Tất Cả Cùng Lúc

```bash
npx prisma generate && npx prisma db push && npm run prisma:seed && npm run dev
```

---

## ✅ Kết Quả Mong Đợi

Sau khi chạy seed, bạn sẽ thấy:

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
```

---

## 🌐 Mở Trình Duyệt

```
http://localhost:3000
```

---

## 🔑 Đăng Nhập Ngay

### Admin (Toàn quyền)
```
Email:    admin@example.com
Password: Admin@123456
```

### Staff (Quản lý sản phẩm & đơn hàng)
```
Email:    maianh.staff@example.com
Password: Staff@123456
```

### Customer (Xem sản phẩm & đơn hàng của mình)
```
Email:    khang.customer@example.com
Password: Customer@123456
```

---

## 📚 Đọc Thêm

- `VIETNAMESE_USERS_GUIDE.md` - Hướng dẫn đầy đủ
- `QUICK_START_VIETNAMESE_USERS.md` - Quick start chi tiết
- `README.md` - Tổng quan dự án

---

## 🔄 Reset Database (Nếu Cần)

```bash
npx prisma migrate reset
```

Lệnh này sẽ xóa tất cả dữ liệu và seed lại.

---

## 🎉 Xong!

Bạn đã có **14 fake users tiếng Việt** sẵn sàng để demo!

**Chúc bạn demo thành công! 🚀**
