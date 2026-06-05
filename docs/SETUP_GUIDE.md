# Hướng Dẫn Cài Đặt Chi Tiết - RBAC System

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

1. **Node.js** (phiên bản 18 trở lên)
   - Download: https://nodejs.org/
   - Kiểm tra: `node --version`

2. **PostgreSQL** (phiên bản 14 trở lên)
   - Download: https://www.postgresql.org/download/
   - Kiểm tra: `psql --version`

3. **Git** (tùy chọn, để clone repository)
   - Download: https://git-scm.com/

4. **Code Editor** (khuyến nghị VS Code)
   - Download: https://code.visualstudio.com/

---

## Bước 1: Cài Đặt PostgreSQL

### Windows

1. Download PostgreSQL installer từ https://www.postgresql.org/download/windows/
2. Chạy installer, chọn:
   - Port: 5432 (mặc định)
   - Password cho user `postgres`: nhớ password này
3. Sau khi cài xong, mở Command Prompt hoặc PowerShell
4. Kiểm tra: `psql --version`

### macOS

```bash
# Dùng Homebrew
brew install postgresql@14
brew services start postgresql@14

# Hoặc download từ https://postgresapp.com/
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Bước 2: Tạo Database

### Cách 1: Dùng psql (Command Line)

```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Trong psql prompt:
CREATE DATABASE rbac_db;

# Kiểm tra database đã tạo
\l

# Thoát
\q
```

### Cách 2: Dùng pgAdmin (GUI)

1. Mở pgAdmin
2. Kết nối vào server PostgreSQL
3. Right-click "Databases" → "Create" → "Database"
4. Nhập tên: `rbac_db`
5. Click "Save"

---

## Bước 3: Clone/Download Project

### Nếu có Git

```bash
git clone <repository-url>
cd rbac-asvs-level2
```

### Nếu không có Git

1. Download ZIP file từ repository
2. Giải nén vào thư mục mong muốn
3. Mở terminal/command prompt tại thư mục đó

---

## Bước 4: Cài Đặt Dependencies

```bash
# Cài đặt tất cả packages
npm install

# Hoặc dùng yarn
yarn install
```

**Lưu ý**: Quá trình này có thể mất vài phút tùy vào tốc độ internet.

---

## Bước 5: Cấu Hình Environment Variables

### 5.1. Tạo file .env

File `.env` đã được tạo sẵn với giá trị mặc định. Bạn cần cập nhật:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/rbac_db?schema=public"
```

Thay `YOUR_PASSWORD` bằng password của PostgreSQL user `postgres`.

### 5.2. Generate JWT Secret (Khuyến nghị)

**Trên Linux/macOS:**
```bash
openssl rand -base64 32
```

**Trên Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy kết quả và thay vào `JWT_SECRET` trong file `.env`.

### 5.3. Cấu Hình Admin Account (Tùy chọn)

Mặc định:
- Email: `admin@example.com`
- Password: `Admin@123456`

Bạn có thể thay đổi trong file `.env`:

```env
ADMIN_EMAIL="youradmin@example.com"
ADMIN_PASSWORD="YourSecurePassword@123"
ADMIN_NAME="Your Name"
```

---

## Bước 6: Chạy Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Chạy migrations để tạo tables
npx prisma migrate dev --name init
```

**Kết quả mong đợi:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied migration 20240101000000_init
```

---

## Bước 7: Seed Dữ Liệu Mẫu

```bash
npm run prisma:seed
```

**Kết quả mong đợi:**
```
🌱 Starting seed...
📝 Creating permissions...
✅ Created 17 permissions
👥 Creating roles...
✅ Created 3 roles
🔗 Assigning permissions to roles...
✅ Assigned permissions to roles
👤 Creating admin user...
✅ Created admin user: admin@example.com
👤 Creating staff user...
✅ Created staff user: staff@example.com
👤 Creating customer user...
✅ Created customer user: customer@example.com
📦 Creating sample products...
✅ Created sample products
🎉 Seed completed successfully!

📋 Test Accounts:
   Admin:    admin@example.com / Admin@123456
   Staff:    staff@example.com / Staff@123456
   Customer: customer@example.com / Customer@123456
```

---

## Bước 8: Chạy Development Server

```bash
npm run dev
```

**Kết quả mong đợi:**
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## Bước 9: Kiểm Tra Hệ Thống

### 9.1. Mở trình duyệt

Truy cập: http://localhost:3000

Bạn sẽ thấy trang chủ với:
- Nút "Login" và "Register"
- Danh sách test accounts
- Mô tả tính năng

### 9.2. Test đăng nhập

1. Click "Login"
2. Nhập:
   - Email: `admin@example.com`
   - Password: `Admin@123456`
3. Click "Login"
4. Bạn sẽ được redirect về `/account`

### 9.3. Test các tính năng

**Admin Account:**
- Vào "Manage Users" → Xem danh sách users
- Vào "Manage Roles" → Xem và cập nhật permissions
- Vào "Audit Logs" → Xem logs

**Staff Account:**
- Vào "View Products" → Xem sản phẩm
- Vào "My Orders" → Xem orders (nếu có)
- Không thấy "Manage Roles" (không có quyền)

**Customer Account:**
- Vào "View Products" → Xem sản phẩm
- Vào "My Orders" → Chỉ xem orders của mình
- Không thấy "Manage Users" hoặc "Manage Roles"

---

## Troubleshooting

### Lỗi: "Can't reach database server"

**Nguyên nhân**: PostgreSQL không chạy hoặc DATABASE_URL sai

**Giải pháp**:
```bash
# Kiểm tra PostgreSQL đang chạy
# Windows
pg_isready

# Linux/macOS
sudo systemctl status postgresql

# Kiểm tra DATABASE_URL trong .env
# Đảm bảo password đúng
```

### Lỗi: "JWT_SECRET is not defined"

**Nguyên nhân**: File `.env` không tồn tại hoặc thiếu JWT_SECRET

**Giải pháp**:
```bash
# Kiểm tra file .env tồn tại
ls -la .env

# Nếu không có, copy từ .env.example
cp .env.example .env

# Cập nhật JWT_SECRET
```

### Lỗi: "Prisma Client not generated"

**Nguyên nhân**: Chưa chạy `prisma generate`

**Giải pháp**:
```bash
npx prisma generate
```

### Lỗi: "Port 3000 already in use"

**Nguyên nhân**: Port 3000 đang được sử dụng bởi ứng dụng khác

**Giải pháp**:
```bash
# Chạy trên port khác
PORT=3001 npm run dev

# Hoặc kill process đang dùng port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Lỗi: "Migration failed"

**Nguyên nhân**: Database đã có tables cũ hoặc schema conflict

**Giải pháp**:
```bash
# Reset database (XÓA TẤT CẢ DỮ LIỆU)
npm run db:reset

# Hoặc xóa database và tạo lại
psql -U postgres
DROP DATABASE rbac_db;
CREATE DATABASE rbac_db;
\q

# Chạy lại migrations
npx prisma migrate dev
npm run prisma:seed
```

---

## Công Cụ Hữu Ích

### Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Mở trình duyệt tại: http://localhost:5555

Bạn có thể:
- Xem tất cả tables
- Thêm/sửa/xóa records
- Xem relationships

### VS Code Extensions (Khuyến nghị)

1. **Prisma** - Syntax highlighting cho schema.prisma
2. **ESLint** - Linting cho TypeScript
3. **Prettier** - Code formatting
4. **Thunder Client** - Test API (thay thế Postman)

---

## Các Lệnh Thường Dùng

```bash
# Development
npm run dev                    # Chạy dev server
npm run build                  # Build production
npm start                      # Chạy production server

# Database
npx prisma generate            # Generate Prisma Client
npx prisma migrate dev         # Tạo migration mới
npm run prisma:seed            # Seed dữ liệu
npm run prisma:studio          # Mở Prisma Studio
npm run db:reset               # Reset database (XÓA DỮ LIỆU)

# Prisma Migrate
npx prisma migrate dev --name <name>  # Tạo migration với tên
npx prisma migrate reset              # Reset migrations
npx prisma migrate deploy             # Deploy migrations (production)
```

---

## Cấu Trúc Database

Sau khi chạy migrations, database sẽ có các tables:

```
users                 - Người dùng
roles                 - Vai trò (ADMIN, STAFF, CUSTOMER)
permissions           - Quyền chi tiết
user_roles            - Bảng trung gian User-Role
role_permissions      - Bảng trung gian Role-Permission
audit_logs            - Logs bảo mật
products              - Sản phẩm
orders                - Đơn hàng
order_items           - Chi tiết đơn hàng
```

---

## Kiểm Tra Cài Đặt Thành Công

Checklist:

- [ ] PostgreSQL đang chạy
- [ ] Database `rbac_db` đã được tạo
- [ ] File `.env` đã được cấu hình đúng
- [ ] `npm install` chạy thành công
- [ ] `npx prisma migrate dev` chạy thành công
- [ ] `npm run prisma:seed` chạy thành công
- [ ] `npm run dev` chạy thành công
- [ ] Truy cập http://localhost:3000 thành công
- [ ] Đăng nhập với admin account thành công
- [ ] Xem được danh sách users, roles, audit logs

Nếu tất cả đều ✅, bạn đã cài đặt thành công!

---

## Tiếp Theo

1. Đọc [README.md](./README.md) để hiểu tổng quan hệ thống
2. Đọc [RBAC_ASVS_LEVEL2_REPORT.md](./RBAC_ASVS_LEVEL2_REPORT.md) để hiểu chi tiết về RBAC và ASVS Level 2
3. Đọc [TEST_CASES.md](./TEST_CASES.md) để xem các test cases
4. Bắt đầu test các tính năng theo hướng dẫn trong TEST_CASES.md

---

## Hỗ Trợ

Nếu gặp vấn đề không có trong Troubleshooting:

1. Kiểm tra logs trong terminal
2. Kiểm tra browser console (F12)
3. Kiểm tra PostgreSQL logs
4. Tham khảo tài liệu:
   - Next.js: https://nextjs.org/docs
   - Prisma: https://www.prisma.io/docs
   - PostgreSQL: https://www.postgresql.org/docs/

---

**Chúc bạn thành công với đề tài!** 🎉
