# Hướng Dẫn Fake Users Tiếng Việt

## 📋 Tổng Quan

Dự án đã được cập nhật với **14 fake users tiếng Việt** để phục vụ demo hệ thống RBAC và AI chatbot.

### Đặc Điểm

✅ **Dữ liệu hoàn toàn giả lập** - Không sử dụng thông tin người thật
✅ **Tên tiếng Việt** - Phù hợp với thị trường Việt Nam
✅ **Email domain giả** - Sử dụng @example.com
✅ **Password đã hash** - Sử dụng bcryptjs với 12 rounds
✅ **Phân quyền rõ ràng** - 1 Admin, 3 Staff, 10 Customer
✅ **Sản phẩm tiếng Việt** - 6 sản phẩm digital account phổ biến

---

## 👥 Danh Sách Fake Users

### 👑 ADMIN (1 người)

| Tên | Email | Password | Quyền |
|-----|-------|----------|-------|
| Nguyễn Minh Quân | admin@example.com | Admin@123456 | Toàn quyền |

### 👔 STAFF (3 người)

| Tên | Email | Password | Quyền |
|-----|-------|----------|-------|
| Trần Quốc Bảo | staff@example.com | Staff@123456 | Quản lý sản phẩm & đơn hàng |
| Lê Thị Mai Anh | maianh.staff@example.com | Staff@123456 | Quản lý sản phẩm & đơn hàng |
| Phạm Hoàng Nam | hoangnam.staff@example.com | Staff@123456 | Quản lý sản phẩm & đơn hàng |

### 👤 CUSTOMER (10 người)

| Tên | Email | Password | Quyền |
|-----|-------|----------|-------|
| Nguyễn Văn An | an.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Trần Thị Bích Ngọc | bichngoc.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Lê Minh Khang | khang.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Phạm Gia Huy | giahuy.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Hoàng Thanh Tâm | thanhtam.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Đỗ Hải Đăng | haidang.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Vũ Phương Linh | phuonglinh.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Bùi Nhật Minh | nhatminh.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Đặng Khánh Vy | khanhvy.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |
| Nguyễn Tuấn Kiệt | tuankiet.customer@example.com | Customer@123456 | Xem sản phẩm & đơn hàng của mình |

---

## 📦 Sản Phẩm Mẫu (Tiếng Việt)

1. **Tài khoản Netflix Premium** - 180,000 VNĐ
   - Gói 1 tháng, xem không giới hạn, chất lượng 4K

2. **Tài khoản Spotify Premium** - 59,000 VNĐ
   - Gói 1 tháng, nghe nhạc không quảng cáo

3. **Tài khoản Disney+ Premium** - 150,000 VNĐ
   - Gói 1 tháng, xem phim Disney, Marvel, Star Wars

4. **Tài khoản YouTube Premium** - 79,000 VNĐ
   - Gói 1 tháng, xem video không quảng cáo

5. **Tài khoản Canva Pro** - 120,000 VNĐ
   - Gói 1 tháng, thiết kế đồ họa chuyên nghiệp

6. **Tài khoản ChatGPT Plus** - 450,000 VNĐ
   - Gói 1 tháng, truy cập GPT-4 không giới hạn

---

## 🚀 Cách Chạy Seed

### Bước 1: Generate Prisma Client

```bash
npx prisma generate
```

### Bước 2: Push Schema lên Database

```bash
npx prisma db push
```

**Hoặc** nếu muốn tạo migration:

```bash
npx prisma migrate dev --name add_vietnamese_users
```

### Bước 3: Chạy Seed Script

```bash
npx prisma db seed
```

**Hoặc** dùng npm script:

```bash
npm run prisma:seed
```

### Bước 4: Chạy Development Server

```bash
npm run dev
```

---

## 📊 Kết Quả Mong Đợi

Sau khi chạy seed, bạn sẽ thấy output như sau:

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

## 🧪 Test Scenarios

### Test 1: Đăng Nhập với Admin

```bash
1. Mở http://localhost:3000/login
2. Email: admin@example.com
3. Password: Admin@123456
4. → Đăng nhập thành công
5. → Có quyền truy cập /admin/users, /admin/roles, /admin/audit
```

### Test 2: Đăng Nhập với Staff

```bash
1. Mở http://localhost:3000/login
2. Email: maianh.staff@example.com
3. Password: Staff@123456
4. → Đăng nhập thành công
5. → Có quyền quản lý sản phẩm và đơn hàng
6. → KHÔNG có quyền quản lý roles
```

### Test 3: Đăng Nhập với Customer

```bash
1. Mở http://localhost:3000/login
2. Email: khang.customer@example.com
3. Password: Customer@123456
4. → Đăng nhập thành công
5. → Chỉ xem được sản phẩm và đơn hàng của mình
6. → KHÔNG truy cập được /admin/*
```

### Test 4: Horizontal Access Control

```bash
1. Đăng nhập với an.customer@example.com
2. Tạo order
3. Logout, đăng nhập với bichngoc.customer@example.com
4. Thử truy cập order của An
5. → 404 Not Found (che giấu tài nguyên)
```

---

## 💬 Ví Dụ Chat Messages (Cho AI Chatbot)

Nếu bạn muốn thêm tính năng AI chatbot, đây là một số câu hỏi mẫu tiếng Việt:

### Câu Hỏi Về Sản Phẩm

- "Shop ơi, tài khoản Netflix còn hạn bao lâu?"
- "Mình muốn mua tài khoản Spotify Premium."
- "Tài khoản ChatGPT Plus có gì khác so với bản free?"
- "Giá tài khoản Disney+ bao nhiêu vậy shop?"

### Câu Hỏi Về Đơn Hàng

- "Mình vừa thanh toán xong, khi nào nhận được tài khoản?"
- "Đơn hàng của mình đang ở trạng thái nào?"
- "Làm sao để kiểm tra lịch sử mua hàng?"

### Câu Hỏi Về Bảo Hành

- "Tài khoản bị đổi mật khẩu thì xử lý sao?"
- "Có bảo hành tài khoản không?"
- "Nếu tài khoản bị lỗi thì shop có đổi không?"

### Câu Hỏi Về Thanh Toán

- "Shop nhận thanh toán qua những hình thức nào?"
- "Có thể thanh toán bằng Momo không?"
- "Sau khi chuyển khoản bao lâu thì được duyệt?"

---

## 🔐 Bảo Mật

### ✅ Đã Implement

- **Password Hashing**: Tất cả passwords đã được hash bằng bcryptjs với 12 rounds
- **Fake Data**: Không sử dụng thông tin người thật
- **Domain Giả**: Email sử dụng @example.com
- **Upsert Logic**: Không tạo trùng user nếu đã tồn tại
- **Environment Variables**: Không hardcode secrets

### ⚠️ Lưu Ý

- Dữ liệu này **CHỈ DÙNG CHO DEMO**
- **KHÔNG** sử dụng trong production
- **KHÔNG** commit file `.env` vào git
- Thay đổi tất cả passwords trong production

---

## 🎯 Use Cases

### 1. Demo RBAC System

- Đăng nhập với các roles khác nhau
- Test vertical privilege escalation
- Test horizontal privilege escalation
- Xem audit logs

### 2. Demo AI Chatbot

- Khách hàng hỏi về sản phẩm
- Khách hàng hỏi về đơn hàng
- Staff trả lời câu hỏi
- Admin quản lý hệ thống

### 3. Training & Testing

- Training nhân viên mới
- Testing tính năng mới
- Demo cho khách hàng
- Presentation cho giảng viên

---

## 🛠️ Troubleshooting

### Lỗi: "User already exists"

**Nguyên nhân**: User đã tồn tại trong database

**Giải pháp**: Script sử dụng `upsert`, không tạo trùng. Nếu muốn reset:

```bash
npx prisma migrate reset
npm run prisma:seed
```

### Lỗi: "Cannot find module '../src/lib/password'"

**Nguyên nhân**: Chưa build TypeScript

**Giải pháp**:

```bash
npx prisma generate
npm run dev
```

### Lỗi: "Database connection failed"

**Nguyên nhân**: PostgreSQL không chạy hoặc DATABASE_URL sai

**Giải pháp**:

```bash
# Kiểm tra PostgreSQL
pg_isready

# Kiểm tra DATABASE_URL trong .env
cat .env
```

---

## 📚 Tài Liệu Liên Quan

- `README.md` - Hướng dẫn tổng quan
- `SETUP_GUIDE.md` - Hướng dẫn cài đặt chi tiết
- `DEMO_GUIDE.md` - Hướng dẫn demo
- `TEST_CASES.md` - Test cases chi tiết
- `RBAC_ASVS_LEVEL2_REPORT.md` - Báo cáo chính thức

---

## ✅ Checklist

- [x] Tạo 14 fake users tiếng Việt
- [x] Hash tất cả passwords bằng bcryptjs
- [x] Gán roles phù hợp (1 Admin, 3 Staff, 10 Customer)
- [x] Tạo 6 sản phẩm tiếng Việt
- [x] Sử dụng email domain giả
- [x] Không hardcode secrets
- [x] Upsert logic để tránh trùng
- [x] In ra danh sách tài khoản sau khi seed
- [x] Documentation đầy đủ

---

**🎉 Chúc bạn demo thành công với fake users tiếng Việt!**
