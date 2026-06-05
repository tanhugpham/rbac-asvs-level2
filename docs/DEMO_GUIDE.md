# Hướng Dẫn Demo - RBAC System ASVS Level 2

## 📋 Chuẩn Bị Trước Khi Demo

### 1. Kiểm Tra Hệ Thống

```bash
# Đảm bảo database đang chạy
pg_isready

# Đảm bảo có dữ liệu seed
npm run prisma:seed

# Chạy dev server
npm run dev
```

### 2. Chuẩn Bị Trình Duyệt

- Mở 3 cửa sổ trình duyệt (hoặc 3 profiles):
  - Cửa sổ 1: Admin account
  - Cửa sổ 2: Staff account  
  - Cửa sổ 3: Customer account

- Hoặc dùng Incognito/Private windows

### 3. Chuẩn Bị Tools

- **Postman** hoặc **Thunder Client** (VS Code extension) để test API
- **Browser DevTools** (F12) để xem Network và Console

---

## 🎬 Kịch Bản Demo (15-20 phút)

### Phần 1: Giới Thiệu Tổng Quan (2 phút)

**Nội dung trình bày:**

> "Xin chào thầy/cô và các bạn. Em xin trình bày đề tài: **Xây dựng hệ thống phân quyền RBAC đạt chuẩn OWASP ASVS Level 2**.
>
> Hệ thống này giải quyết bài toán kiểm soát truy cập trong ứng dụng web, đảm bảo:
> - Mỗi user chỉ có quyền truy cập những tài nguyên phù hợp với vai trò
> - Ngăn chặn truy cập trái phép theo chiều dọc và chiều ngang
> - Ghi log đầy đủ các hành vi bảo mật
> - Tuân thủ các yêu cầu của OWASP ASVS Level 2
>
> Hệ thống có 3 vai trò chính:
> - **ADMIN**: Toàn quyền quản trị
> - **STAFF**: Quản lý sản phẩm và đơn hàng
> - **CUSTOMER**: Xem sản phẩm và đơn hàng của mình"

**Hiển thị:**
- Trang chủ với mô tả tính năng
- Slide/diagram về RBAC model (nếu có)

---

### Phần 2: Demo Authentication (3 phút)

#### 2.1. Đăng Nhập Thành Công

**Steps:**
1. Mở trang `/login`
2. Đăng nhập với Admin:
   - Email: `admin@example.com`
   - Password: `Admin@123456`
3. Redirect về `/account`

**Giải thích:**
> "Khi đăng nhập thành công, hệ thống:
> - Xác thực email/password với bcrypt
> - Tạo JWT token
> - Lưu token vào HTTP-only cookie (bảo mật, không thể access từ JavaScript)
> - Redirect về trang account"

**Hiển thị:**
- Trang `/account` với thông tin user
- Danh sách roles và permissions của user
- DevTools → Application → Cookies → `auth_token` (HTTP-only)

#### 2.2. Đăng Nhập Thất Bại

**Steps:**
1. Logout
2. Thử đăng nhập với password sai
3. Hiển thị error: "Invalid email or password"

**Giải thích:**
> "Hệ thống không tiết lộ thông tin cụ thể (email có tồn tại hay không) để tránh information leakage."

---

### Phần 3: Demo Authorization - Vertical Privilege Escalation (4 phút)

#### 3.1. Customer Không Thể Truy Cập Admin Functions

**Steps:**
1. Đăng nhập với Customer (`customer@example.com`)
2. Vào trang `/account`
3. **Chỉ ra**: Không có nút "Manage Users" hoặc "Manage Roles"
4. Thử truy cập trực tiếp `/admin/users`
   - **Kết quả**: Bị chặn, redirect về login hoặc 403

**Giải thích:**
> "UI ẩn các nút mà user không có quyền để cải thiện UX. Nhưng đây không phải lớp bảo mật chính."

#### 3.2. Bypass UI Bằng API Call

**Steps:**
1. Mở DevTools → Console
2. Gọi API trực tiếp:
```javascript
fetch('/api/users')
  .then(r => r.json())
  .then(console.log)
```
3. **Kết quả**: 403 Forbidden

**Giải thích:**
> "Mặc dù bypass được UI, server vẫn kiểm tra quyền. Đây là nguyên tắc **server-side enforcement** của ASVS Level 2."

#### 3.3. Kiểm Tra Audit Log

**Steps:**
1. Đăng nhập với Admin
2. Vào `/admin/audit`
3. Tìm log ACCESS_DENIED của customer

**Hiển thị:**
- userId: customer's ID
- action: ACCESS_DENIED
- resource: "GET /api/users"
- permission: "user:read"
- status: DENIED
- IP address và timestamp

**Giải thích:**
> "Mọi lần truy cập bị từ chối đều được ghi log để phát hiện các hành vi đáng ngờ."

---

### Phần 4: Demo Authorization - Horizontal Privilege Escalation (4 phút)

#### 4.1. Customer Không Thể Xem Order Của Customer Khác

**Chuẩn bị:**
- Tạo order cho Customer A (hoặc dùng order có sẵn)
- Lấy order ID

**Steps:**
1. Đăng nhập với Customer A
2. Vào `/orders` → Xem order của mình → Thành công
3. Copy order ID
4. Đăng nhập với Customer B (hoặc dùng cửa sổ khác)
5. Thử truy cập `/orders/{order_id_of_A}`
   - **Kết quả**: 404 Not Found

**Giải thích:**
> "Hệ thống trả về 404 thay vì 403 để che giấu sự tồn tại của order. Đây là best practice để tránh information leakage.
>
> Code kiểm tra:
> ```typescript
> const isOwner = order.userId === user.id;
> const hasPermission = user.permissions.includes('order:read');
> 
> if (!isOwner && !hasPermission) {
>   throw new NotFoundError(); // 404, không phải 403
> }
> ```"

#### 4.2. Admin/Staff Có Thể Xem Mọi Order

**Steps:**
1. Đăng nhập với Admin hoặc Staff
2. Vào `/orders`
3. Thấy tất cả orders của mọi customer

**Giải thích:**
> "Admin và Staff có permission `order:read` nên có thể xem tất cả orders."

---

### Phần 5: Demo Resource-level Authorization (3 phút)

#### 5.1. Account Secret Protection

**Scenario**: Thông tin tài khoản sau khi mua chỉ hiển thị cho:
- Chủ sở hữu order
- User có permission `account:read_secret`

**Steps:**
1. Đăng nhập với Customer
2. Vào order của chính mình
3. **Hiển thị**: Account secret được hiển thị đầy đủ

4. Đăng nhập với Staff
5. Vào order của bất kỳ customer nào
6. **Hiển thị**: Account secret được hiển thị (có permission)

**Giải thích:**
> "Đây là ví dụ về **fine-grained authorization**. Không chỉ kiểm tra ownership, mà còn kiểm tra permission cụ thể."

---

### Phần 6: Demo Admin Functions (3 phút)

#### 6.1. Quản Lý Users

**Steps:**
1. Đăng nhập với Admin
2. Vào `/admin/users`
3. Hiển thị danh sách users với roles
4. Click "Manage Roles" cho một user
5. Gán/xóa role

**Giải thích:**
> "Admin có thể gán nhiều roles cho một user. Permissions của user là tổng hợp của tất cả roles."

#### 6.2. Quản Lý Roles và Permissions

**Steps:**
1. Vào `/admin/roles`
2. Hiển thị danh sách roles với permissions
3. Chọn một role (ví dụ: CUSTOMER)
4. Cập nhật permissions (check/uncheck)
5. Save changes

**Giải thích:**
> "Admin có thể tùy chỉnh permissions cho từng role. Thay đổi này ảnh hưởng ngay lập tức đến tất cả users có role đó."

---

### Phần 7: Demo Security Features (2 phút)

#### 7.1. Password Strength Validation

**Steps:**
1. Vào `/register`
2. Thử đăng ký với password yếu: `weak`
3. **Hiển thị**: Validation errors chi tiết

**Giải thích:**
> "Hệ thống yêu cầu password mạnh: ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."

#### 7.2. Error Handling

**Steps:**
1. Gọi API với invalid data
2. **Hiển thị**: Error response không có stack trace

**Giải thích:**
> "Error messages không để lộ thông tin nhạy cảm như database structure, file paths, hoặc stack traces."

---

### Phần 8: Demo với Postman/API Testing (2 phút)

#### 8.1. Test API Authorization

**Steps:**
1. Mở Postman
2. Gọi `GET http://localhost:3000/api/users` không có cookie
   - **Kết quả**: 401 Unauthorized

3. Lấy cookie của Customer (từ browser DevTools)
4. Gọi lại với cookie
   - **Kết quả**: 403 Forbidden

5. Lấy cookie của Admin
6. Gọi lại với cookie
   - **Kết quả**: 200 Success, trả về danh sách users

**Giải thích:**
> "API được bảo vệ đầy đủ, không thể bypass bằng cách gọi trực tiếp."

---

## 🎯 Điểm Nhấn Khi Demo

### 1. Server-side Enforcement

**Nhấn mạnh:**
> "Mọi kiểm tra quyền đều thực hiện ở server. UI chỉ ẩn/hiện nút để cải thiện UX, không phải lớp bảo mật."

**Demo:**
- Bypass UI bằng DevTools Console
- Gọi API trực tiếp bằng Postman
- Vẫn bị chặn bởi server

### 2. Fail Securely

**Nhấn mạnh:**
> "Hệ thống mặc định từ chối khi thiếu thông tin. Không có permission = không có quyền."

**Demo:**
- Không có token → 401
- Không có permission → 403
- Lỗi trong kiểm tra quyền → từ chối truy cập

### 3. Audit Logging

**Nhấn mạnh:**
> "Mọi hành vi bảo mật đều được ghi log: access denied, login, thay đổi roles/permissions."

**Demo:**
- Xem audit logs sau mỗi hành động
- Hiển thị thông tin đầy đủ: userId, action, resource, IP, timestamp

### 4. No Information Leakage

**Nhấn mạnh:**
> "Error messages không để lộ thông tin nhạy cảm. Dùng 404 thay vì 403 để che giấu tài nguyên."

**Demo:**
- Customer xem order của người khác → 404
- Error response không có stack trace

---

## 📊 Slide Presentation (Nếu Có)

### Slide 1: Title
- Tên đề tài
- Họ tên, lớp, môn học

### Slide 2: Mục Tiêu
- Xây dựng RBAC system
- Tuân thủ OWASP ASVS Level 2
- Ngăn chặn truy cập trái phép

### Slide 3: RBAC Model
- Diagram: User → Role → Permission
- 3 roles: ADMIN, STAFF, CUSTOMER
- 17 permissions

### Slide 4: Ma Trận Quyền Hạn
- Bảng Role-Permission matrix

### Slide 5: Kiến Trúc Hệ Thống
- Tech stack
- Security layers
- Database schema

### Slide 6: OWASP ASVS Level 2 Compliance
- V4: Access Control ✅
- V7: Error Handling ✅
- V2: Authentication ✅

### Slide 7: Test Results
- 36/36 test cases PASS
- Bảng tổng kết test categories

### Slide 8: Demo
- Live demo

### Slide 9: Kết Luận
- Đã hoàn thành đầy đủ yêu cầu
- Tuân thủ ASVS Level 2
- Sẵn sàng production

---

## 🤔 Câu Hỏi Thường Gặp

### Q1: Tại sao dùng JWT thay vì session?

**Trả lời:**
> "JWT có ưu điểm:
> - Stateless: không cần lưu session ở server
> - Scalable: dễ scale horizontal
> - Self-contained: chứa thông tin user
>
> Nhưng em vẫn đảm bảo bảo mật bằng:
> - HTTP-only cookie (không thể access từ JS)
> - Secure flag trong production
> - Token expiry
> - Server vẫn query database để lấy permissions mới nhất"

### Q2: Nếu admin thay đổi permission của role, user đang đăng nhập có bị ảnh hưởng ngay không?

**Trả lời:**
> "Có. Mỗi request, server đều query database để lấy permissions mới nhất của user. Không cache permissions cross-request.
>
> Code:
> ```typescript
> export const getCurrentUser = cache(async () => {
>   // Cache trong request scope, không cache cross-request
>   // Query database mỗi request
> });
> ```"

### Q3: Tại sao trả về 404 thay vì 403 cho horizontal access control?

**Trả lời:**
> "Đây là best practice để tránh information leakage.
>
> - 403: Tiết lộ rằng tài nguyên tồn tại nhưng user không có quyền
> - 404: Che giấu sự tồn tại của tài nguyên
>
> Ví dụ: Customer A không nên biết Customer B có order nào."

### Q4: Làm sao đảm bảo không có SQL injection?

**Trả lời:**
> "Em dùng Prisma ORM, tự động parameterize queries. Không có raw SQL queries.
>
> Ví dụ:
> ```typescript
> // Prisma tự động escape
> await prisma.user.findUnique({
>   where: { email: userInput }
> });
> ```"

### Q5: Có test automated không?

**Trả lời:**
> "Hiện tại em có 36 test cases được documented chi tiết và test thủ công.
>
> Hướng phát triển: Viết automated tests với Jest/Vitest cho:
> - Unit tests cho authorization functions
> - Integration tests cho API routes
> - E2E tests với Playwright"

---

## ✅ Checklist Trước Khi Demo

- [ ] Database đang chạy và có dữ liệu seed
- [ ] Dev server đang chạy (`npm run dev`)
- [ ] Đã test tất cả flows một lần
- [ ] Chuẩn bị 3 browser windows/profiles
- [ ] Postman/Thunder Client đã setup
- [ ] Slides đã chuẩn bị (nếu có)
- [ ] Đã đọc qua câu hỏi thường gặp
- [ ] Backup: có video demo (phòng trường hợp lỗi)

---

## 🎬 Tips Khi Demo

1. **Nói chậm, rõ ràng**: Giải thích từng bước đang làm gì

2. **Zoom in**: Đảm bảo mọi người nhìn thấy text trên màn hình

3. **Highlight quan trọng**: Dùng DevTools để highlight code, network requests

4. **Có backup plan**: Nếu live demo lỗi, có video hoặc screenshots

5. **Tự tin**: Bạn đã build hệ thống này, bạn hiểu nó nhất!

---

**Chúc bạn demo thành công!** 🎉
