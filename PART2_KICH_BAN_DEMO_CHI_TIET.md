# 🎬 PHẦN 2: KỊCH BẢN DEMO CHI TIẾT

## ⏱️ TỔNG THỜI GIAN: 15 PHÚT

---

## 📝 PHẦN 1: GIỚI THIỆU (1 phút)

### Script đầy đủ

```
"Xin chào thầy/cô và các bạn.

Nhóm em xin phép demo đồ án:
'Interactive Security Demonstration Platform - RBAC OWASP ASVS Level 2'

[Pause 2 giây]

Đây là hệ thống quản lý phân quyền với 3 roles:
- ADMIN: Toàn quyền
- STAFF: Quản lý sản phẩm và đơn hàng
- CUSTOMER: Chỉ xem được tài nguyên của mình

[Pause 2 giây]

Điểm đặc biệt của hệ thống là tính năng Live Attack Simulation
để visualize real-time cách hệ thống chặn các cuộc tấn công trái phép.

[Pause 2 giây]

Em sẽ demo theo thứ tự:
1. Live Attack Simulation - feature highlight
2. RBAC Matrix và Authorization Flow
3. Demo với các roles khác nhau
4. Giải thích OWASP ASVS compliance

Bắt đầu ạ."
```

### Lưu ý
- ✅ Nói chậm, rõ ràng
- ✅ Pause giữa các câu
- ✅ Nhìn vào giảng viên khi nói
- ✅ Tự tin, không đọc giấy

---

## ⭐ PHẦN 2: LIVE ATTACK SIMULATION (5 phút)

**ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT!**

### Bước 1: Login ADMIN (30 giây)

**Thao tác**:
```
1. Mở browser: http://localhost:3000/login
2. Click vào card "Admin User" (màu đỏ)
3. Hoặc nhập: admin@example.com / Admin@123456
4. Click "Đăng nhập"
```

**Script**:
```
"Em sẽ login với ADMIN account để có full access."

[Đợi redirect về dashboard]

"Login thành công. Bây giờ em vào trang Attack Simulation."
```

### Bước 2: Vào Attack Simulation (15 giây)

**Thao tác**:
```
URL: http://localhost:3000/security/attack-simulation
```

**Script**:
```
"Đây là trang Live Attack Simulation.

[Point to màn hình]
Bên trái là 6 attack scenarios với severity khác nhau:
- HIGH: Màu đỏ
- CRITICAL: Màu đỏ đậm
- MEDIUM: Màu vàng
- LOW: Màu xanh

Bên phải là terminal để hiển thị real-time attack flow."
```

### Bước 3: Run Scenario 1 - Customer → Admin (2 phút)

**Thao tác**:
```
1. Click vào card "Customer → Admin Dashboard"
2. Đợi animation chạy (mỗi step 600ms)
3. Quan sát terminal output
```

**Script chi tiết**:

```
"Em sẽ mô phỏng scenario đầu tiên:
CUSTOMER cố truy cập Admin Dashboard.

[Click vào scenario]

Các bạn quan sát terminal...

[Khi Step 1 xuất hiện]
'Step 1: User clicks Admin Dashboard link - Success'

[Khi Step 2 xuất hiện]
'Step 2: Middleware check authentication - Pass
JWT token hợp lệ, user đã authenticated.'

[Khi Step 3 xuất hiện]
'Step 3: Middleware check route protection - Pass
Route /admin yêu cầu authentication, user đã login.'

[Khi Step 4 xuất hiện]
'Step 4: Server load user session - Pass
Load thông tin user từ database:
Email: an.customer@example.com
Roles: [CUSTOMER]'

[Khi Step 5 xuất hiện - BLOCKED]
'Step 5: Authorization check permission audit:read - BLOCKED!

[Point to màn hình, nói to]
ĐÂY! Attack bị chặn tại Authorization Layer!

CUSTOMER không có permission audit:read.
User chỉ có permissions: [product:read, order:read_own]

[Point to blocked highlight]
Hệ thống hiển thị: 🛡️ ATTACK BLOCKED
Security layer đã chặn thành công.'

[Khi Step 6 xuất hiện]
'Step 6: Audit Log - Success
Hệ thống tự động ghi log với:
- Severity: HIGH
- Action: ACCESS_DENIED
- Timestamp: [current time]'

[Khi Step 7 xuất hiện]
'Step 7: Response - Redirect to /403
User được redirect về trang Access Denied với explanation đầy đủ.'

[Đợi final summary xuất hiện]

'Các bạn thấy đây, final summary:
- Attack Successfully Blocked ✅
- Blocked at: Authorization Layer (Step 5)

[Point to OWASP ASVS section]
Tuân thủ OWASP ASVS Level 2:
- V4.1.1: Access control enforced on server-side
- V4.1.3: Principle of least privilege
- V4.1.5: Access controls fail securely
- V7.1.1: Security event logged

[Point to audit log ID]
Và đây là audit log ID đã được tạo trong database.'
```

### Bước 4: Run Scenario 2 - Staff → Modify Role (1.5 phút)

**Thao tác**:
```
1. Click "Reset" button
2. Click vào card "Staff → Modify Admin Role"
3. Đợi animation
```

**Script**:
```
"Bây giờ em demo scenario nghiêm trọng hơn:
STAFF cố sửa role của ADMIN.

[Click scenario]

Đây là CRITICAL severity attack.

[Đợi animation chạy đến blocked step]

'Blocked tại API Authorization Layer!

STAFF không có permission role:update.

[Point to màn hình]
Đây là ví dụ về principle of least privilege:
- STAFF có quyền: product:*, order:*, user:read
- STAFF KHÔNG có quyền: role:update, role:delete

Hệ thống:
- Tạo CRITICAL audit log
- Return 403 Forbidden
- Không cho phép role modification

Đây là cách hệ thống bảo vệ khỏi privilege escalation attack.'"
```

### Bước 5: Giải thích ngắn (30 giây)

**Script**:
```
"Tóm lại, Live Attack Simulation cho thấy:

1. Multi-layer security:
   Middleware → Authorization → Audit Log

2. Server-side enforcement:
   Không thể bypass bằng cách modify client code

3. Fail securely:
   Mặc định từ chối nếu không đủ quyền

4. Audit logging:
   Mọi attempt đều được ghi log

5. OWASP ASVS compliance:
   Tuân thủ industry standard

Bây giờ em sẽ demo các visualization pages khác."
```

---

## 📊 PHẦN 3: SECURITY VISUALIZATION (3 phút)

### Bước 1: RBAC Matrix (1 phút)

**Thao tác**:
```
URL: http://localhost:3000/security/rbac-matrix
```

**Script**:
```
"Đây là RBAC Permission Matrix.

[Point to table]
- Cột: 3 roles (ADMIN, STAFF, CUSTOMER)
- Hàng: 17 permissions
- Xanh ✓ = allowed
- Đỏ ✗ = denied

[Hover vào một cell]
Khi hover sẽ thấy tooltip giải thích permission.

[Point to ADMIN column]
ADMIN có tất cả 17 permissions.

[Point to STAFF column]
STAFF chỉ có 8 permissions:
- user:read
- product:* (tất cả product permissions)
- order:read, order:manage
- account:read_secret

[Point to CUSTOMER column]
CUSTOMER chỉ có 2 permissions:
- product:read
- order:read_own (chỉ xem own orders)

[Point to legend]
Đây là legend giải thích và OWASP ASVS compliance note."
```

### Bước 2: Authorization Flow (1 phút)

**Thao tác**:
```
URL: http://localhost:3000/security/flow
```

**Script**:
```
"Đây là Authorization Flow - 10 bước xác thực:

[Point to diagram, từ trên xuống]
1. User Request
2. Middleware - kiểm tra JWT
3. JWT Verification - verify signature
4. Get User Session - load từ database
5. Role Validation - check roles
6. Permission Check - check permissions
7. Resource Ownership - check ownership nếu cần
8. Authorization Decision - allow hoặc deny
9. Audit Logging - ghi log
10. Response - trả về result

[Point to OWASP ASVS card]
Tất cả đều server-side, tuân thủ OWASP ASVS V4.1.1."
```

### Bước 3: Security Analytics (1 phút)

**Thao tác**:
```
URL: http://localhost:3000/security/analytics
```

**Script**:
```
"Security Analytics Dashboard:

[Point to stat cards]
- Total Requests: [số]
- Successful: [số]
- Denied: [số]
- Active Users: [số]

[Point to line chart]
Line chart: Requests theo ngày
- Xanh: Success
- Đỏ: Denied

[Point to pie chart]
Pie chart: Role distribution
- Phân bố users theo roles

[Point to bar chart]
Bar chart: Top denied permissions
- Permissions bị deny nhiều nhất

[Point to security score]
Security Score: [%] success rate."
```

---

## 👥 PHẦN 4: DEMO STAFF & CUSTOMER (3 phút)

### Bước 1: Demo STAFF (1.5 phút)

**Thao tác**:
```
1. Logout ADMIN (click logout button)
2. Back to: http://localhost:3000/login
3. Click "Staff User"
4. Login
```

**Script**:
```
"Bây giờ em logout ADMIN và login với STAFF account.

[Login]

Staff Dashboard có:
- Product management
- Order management
- Limited analytics

[Point to 'Limited Access' notice]
STAFF không có quyền:
- Role management
- Permission management
- Security configuration

Bây giờ em thử truy cập RBAC Matrix..."
```

**Thao tác**:
```
URL: http://localhost:3000/security/rbac-matrix
```

**Script**:
```
[Page redirects to 403]

"Đây! Bị chặn và redirect về 403.

[Point to 403 page]
- Current role: STAFF
- Required permission: role:read
- OWASP ASVS explanation
- Audit log notice

Đây là server-side authorization enforcement.
Ngay cả khi STAFF biết URL, vẫn không thể access."
```


### Bước 2: Demo CUSTOMER (1.5 phút)

**Thao tác**:
```
1. Logout STAFF
2. Login: an.customer@example.com / Customer@123456
```

**Script**:
```
"Bây giờ em login với CUSTOMER account.

[Login]

Customer Dashboard:
- View own profile
- View own orders only
- Update profile
- Chat support

CUSTOMER không thể access admin/staff routes.

Em thử truy cập admin dashboard..."
```

**Thao tác**:
```
URL: http://localhost:3000/admin/dashboard
```

**Script**:
```
[Redirects to 403]

"Bị chặn! 403 Forbidden.

CUSTOMER bị chặn hoàn toàn khỏi admin và staff routes.

Đây là cách hệ thống enforce RBAC:
- Mỗi role chỉ access được routes phù hợp
- Server-side check không thể bypass
- Mọi attempt đều được log"
```

---

## 🛡️ PHẦN 5: GIẢI THÍCH OWASP ASVS (2 phút)

**Script đầy đủ**:

```
"Hệ thống tuân thủ OWASP ASVS Level 2.

OWASP ASVS là Application Security Verification Standard
- Chuẩn bảo mật của OWASP
- Level 2 là standard cho production applications

Hệ thống tuân thủ 5 requirements chính:

[Giơ 1 ngón tay]
1. V4.1.1 - Server-side Access Control:
   Tất cả authorization checks đều server-side.
   Middleware, API routes, Server components đều validate.
   Không thể bypass bằng client code.

[Giơ 2 ngón tay]
2. V4.1.3 - Principle of Least Privilege:
   Mỗi role chỉ có permissions cần thiết.
   RBAC matrix thể hiện rõ điều này.
   ADMIN: 17 permissions
   STAFF: 8 permissions
   CUSTOMER: 2 permissions

[Giơ 3 ngón tay]
3. V4.1.5 - Fail Securely:
   Default deny - mặc định từ chối.
   Nếu không đủ quyền → deny và log.
   Không expose sensitive information.

[Giơ 4 ngón tay]
4. V7.1.1 - No Credentials in Logs:
   Audit logs không chứa password hay sensitive data.
   Chỉ log: action, user, timestamp, result, severity.

[Giơ 5 ngón tay]
5. V8.3.4 - Secure Cookie Attributes:
   JWT cookie có:
   - httpOnly: true (prevent XSS)
   - sameSite: lax (CSRF protection)
   - secure: true in production (HTTPS only)
   - maxAge: 7 days

Đây là cách hệ thống đảm bảo security theo chuẩn quốc tế."
```

---

## 🎯 PHẦN 6: KẾT LUẬN (1 phút)

**Script**:

```
"Tóm lại, hệ thống có:

[Pause]

Security Features:
✅ JWT authentication
✅ RBAC với 3 roles, 17 permissions
✅ Server-side authorization
✅ Ownership validation
✅ Audit logging
✅ OWASP ASVS Level 2 compliant

[Pause]

Visualization Features:
✅ RBAC Matrix
✅ Authorization Flow
✅ Security Analytics
✅ Live Attack Simulation ⭐

[Pause]

Demo Highlights:
✅ Live Attack Simulation với real-time animation
✅ Multi-layer security enforcement
✅ OWASP ASVS compliance mapping
✅ Professional UI với dark mode

[Pause]

Em xin cảm ơn thầy/cô và các bạn đã theo dõi.
Em sẵn sàng trả lời câu hỏi ạ."
```

---

## 💡 TIPS KHI DEMO

### Giọng nói
- ✅ Nói rõ ràng, không nhanh
- ✅ Giọng to đủ nghe
- ✅ Pause giữa các câu
- ✅ Nhấn mạnh từ khóa quan trọng

### Cử chỉ
- ✅ Point màn hình khi giải thích
- ✅ Nhìn vào giảng viên khi nói
- ✅ Đứng thẳng, tự tin
- ✅ Không che màn hình

### Xử lý lỗi
- ✅ Bình tĩnh nếu có lỗi
- ✅ "Em sẽ refresh lại trang"
- ✅ Chuyển sang phần khác nếu cần
- ✅ Không hoảng loạn

### Tương tác
- ✅ Hỏi "Các bạn thấy đây..."
- ✅ "Thầy/cô có thể thấy..."
- ✅ Tạo sự chú ý
- ✅ Không đọc giấy

---

## ⏱️ QUẢN LÝ THỜI GIAN

```
00:00 - 01:00  Giới thiệu
01:00 - 06:00  Live Attack Simulation ⭐
06:00 - 09:00  Security Visualization
09:00 - 12:00  Demo STAFF & CUSTOMER
12:00 - 14:00  Giải thích OWASP ASVS
14:00 - 15:00  Kết luận

Total: 15 phút
```

### Nếu thiếu thời gian
- Skip Security Analytics
- Skip CUSTOMER demo
- Rút ngắn OWASP ASVS explanation

### Nếu thừa thời gian
- Demo thêm attack scenarios
- Giải thích chi tiết hơn
- Show audit logs trong database

---

## 🎬 SẴN SÀNG DEMO!

Sau khi học thuộc script này, bạn đã sẵn sàng demo!

**Tiếp theo**: Đọc **PART 3: CÂU HỎI & TRẢ LỜI** để chuẩn bị cho phần Q&A.

---

**Tạo bởi**: Nhóm RBAC Security
**Cập nhật**: May 18, 2026
**Version**: 1.0
