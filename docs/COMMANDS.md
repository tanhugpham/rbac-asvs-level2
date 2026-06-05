# Tổng Hợp Lệnh Hữu Ích - RBAC System

## 📦 Installation & Setup

```bash
# Cài đặt dependencies
npm install

# Hoặc dùng yarn
yarn install

# Hoặc dùng pnpm
pnpm install
```

---

## 🗄️ Database Commands

### PostgreSQL

```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Kết nối vào PostgreSQL
psql -U postgres

# Tạo database
createdb rbac_db

# Xóa database (CẢNH BÁO: Mất tất cả dữ liệu)
dropdb rbac_db

# Backup database
pg_dump -U postgres rbac_db > backup.sql

# Restore database
psql -U postgres rbac_db < backup.sql
```

### Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Tạo migration mới
npx prisma migrate dev --name <migration_name>

# Ví dụ:
npx prisma migrate dev --name add_user_table

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (XÓA TẤT CẢ DỮ LIỆU và chạy lại migrations)
npx prisma migrate reset

# Seed dữ liệu
npm run prisma:seed

# Mở Prisma Studio (GUI)
npm run prisma:studio

# Format schema.prisma
npx prisma format

# Validate schema
npx prisma validate

# Pull schema từ database
npx prisma db pull

# Push schema lên database (không tạo migration)
npx prisma db push
```

---

## 🚀 Development Commands

```bash
# Chạy development server
npm run dev

# Chạy trên port khác
PORT=3001 npm run dev

# Build production
npm run build

# Chạy production server
npm start

# Lint code
npm run lint

# Lint và fix
npm run lint -- --fix
```

---

## 🧪 Testing Commands

```bash
# Chạy tests (khi có)
npm test

# Chạy tests với coverage
npm test -- --coverage

# Chạy tests ở watch mode
npm test -- --watch
```

---

## 🔧 Utility Commands

### Generate JWT Secret

**Linux/macOS:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Check Port Usage

**Linux/macOS:**
```bash
# Xem process đang dùng port 3000
lsof -i :3000

# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```cmd
# Xem process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng Process ID)
taskkill /PID <PID> /F
```

---

## 🐛 Debugging Commands

### View Logs

```bash
# Xem logs của PostgreSQL
# Linux
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# macOS (Homebrew)
tail -f /usr/local/var/log/postgresql@14.log

# Windows
# Xem trong Event Viewer hoặc pgAdmin
```

### Database Queries

```sql
-- Kết nối vào database
psql -U postgres -d rbac_db

-- Xem tất cả tables
\dt

-- Xem structure của table
\d users

-- Xem tất cả users
SELECT * FROM users;

-- Xem users với roles
SELECT u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id;

-- Xem permissions của một user
SELECT DISTINCT p.name
FROM users u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id
JOIN role_permissions rp ON r.id = rp."roleId"
JOIN permissions p ON rp."permissionId" = p.id
WHERE u.email = 'admin@example.com';

-- Xem audit logs gần nhất
SELECT * FROM audit_logs
ORDER BY "createdAt" DESC
LIMIT 10;

-- Đếm số lần access denied
SELECT COUNT(*) FROM audit_logs
WHERE status = 'DENIED';

-- Thoát
\q
```

---

## 🔄 Reset & Cleanup Commands

```bash
# Reset database hoàn toàn
npm run db:reset

# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Xóa .next cache
rm -rf .next

# Xóa Prisma generated files
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# Full cleanup và reinstall
rm -rf node_modules .next package-lock.json
npm install
npx prisma generate
```

---

## 📊 Database Inspection

```bash
# Xem database size
psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('rbac_db'));"

# Xem table sizes
psql -U postgres -d rbac_db -c "
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Xem số records trong mỗi table
psql -U postgres -d rbac_db -c "
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
"
```

---

## 🔐 Security Commands

### Check for Secrets in Code

```bash
# Tìm potential secrets trong code
grep -r "password\|secret\|key" --include="*.ts" --include="*.tsx" src/

# Kiểm tra .env không bị commit
git ls-files | grep "^\.env$"
# Nếu có kết quả → .env đã bị commit (BAD!)

# Remove .env from git history (nếu đã commit nhầm)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Audit Dependencies

```bash
# Kiểm tra vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Fix với breaking changes
npm audit fix --force

# Xem outdated packages
npm outdated
```

---

## 📝 Git Commands

```bash
# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: RBAC system"

# Add remote
git remote add origin <repository-url>

# Push
git push -u origin main

# Check status
git status

# View commit history
git log --oneline

# Create branch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature
```

---

## 🌐 API Testing với curl

### Authentication

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }' \
  -c cookies.txt

# Get current user (với cookie)
curl http://localhost:3000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

### Protected APIs

```bash
# Get users (cần user:read permission)
curl http://localhost:3000/api/users \
  -b cookies.txt

# Get roles (cần role:read permission)
curl http://localhost:3000/api/roles \
  -b cookies.txt

# Get orders
curl http://localhost:3000/api/orders \
  -b cookies.txt

# Get specific order
curl http://localhost:3000/api/orders/<order_id> \
  -b cookies.txt

# Create product (cần product:create permission)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "New Product",
    "description": "Description",
    "price": 19.99,
    "stock": 10
  }'

# Update role permissions (cần role:update permission)
curl -X POST http://localhost:3000/api/roles/<role_id>/permissions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "permissionIds": ["perm_id_1", "perm_id_2"]
  }'

# Assign role to user (cần user:update permission)
curl -X POST http://localhost:3000/api/users/<user_id>/roles \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "roleId": "role_id",
    "action": "assign"
  }'
```

---

## 🔍 Monitoring Commands

### Watch Logs

```bash
# Watch Next.js logs
npm run dev | tee dev.log

# Watch PostgreSQL logs (Linux)
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Watch audit logs (trong database)
watch -n 2 'psql -U postgres -d rbac_db -c "SELECT * FROM audit_logs ORDER BY \"createdAt\" DESC LIMIT 5;"'
```

### Performance Monitoring

```bash
# Xem memory usage của Node.js
node --expose-gc --inspect npm run dev

# Xem database connections
psql -U postgres -d rbac_db -c "
SELECT 
  count(*) as connections,
  state
FROM pg_stat_activity
WHERE datname = 'rbac_db'
GROUP BY state;
"

# Xem slow queries
psql -U postgres -d rbac_db -c "
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
"
```

---

## 📦 Deployment Commands

### Build for Production

```bash
# Build
npm run build

# Test production build locally
npm start

# Set environment
export NODE_ENV=production

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "rbac-app" -- start
pm2 logs rbac-app
pm2 stop rbac-app
pm2 restart rbac-app
```

### Docker (nếu dùng)

```bash
# Build image
docker build -t rbac-app .

# Run container
docker run -p 3000:3000 --env-file .env rbac-app

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🎯 Quick Commands (Thường Dùng Nhất)

```bash
# Setup lần đầu
npm install
cp .env.example .env
# (Cập nhật .env)
npx prisma migrate dev
npm run prisma:seed

# Chạy hàng ngày
npm run dev

# Reset khi cần
npm run db:reset

# Xem database
npm run prisma:studio

# Test API
curl http://localhost:3000/api/auth/me -b cookies.txt
```

---

## 🆘 Emergency Commands

```bash
# Hệ thống không chạy được
rm -rf node_modules .next
npm install
npx prisma generate
npm run dev

# Database bị lỗi
npm run db:reset

# Port bị chiếm
# Linux/macOS
lsof -ti:3000 | xargs kill -9
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Git conflict
git reset --hard HEAD
git pull

# Quên password admin
# Vào database và reset
psql -U postgres -d rbac_db
UPDATE users SET password = '<new_bcrypt_hash>' WHERE email = 'admin@example.com';
```

---

## 📚 Documentation Commands

```bash
# Generate API documentation (nếu dùng tool)
npx swagger-jsdoc -d swaggerDef.js -o swagger.json

# Generate TypeScript documentation
npx typedoc --out docs src/

# Serve documentation
npx http-server docs/
```

---

## ✅ Pre-Demo Checklist Commands

```bash
# 1. Kiểm tra database
pg_isready
psql -U postgres -d rbac_db -c "SELECT COUNT(*) FROM users;"

# 2. Kiểm tra seed data
psql -U postgres -d rbac_db -c "SELECT email FROM users;"

# 3. Kiểm tra server
curl http://localhost:3000

# 4. Kiểm tra API
curl http://localhost:3000/api/auth/me

# 5. Clear audit logs (nếu muốn demo từ đầu)
psql -U postgres -d rbac_db -c "DELETE FROM audit_logs;"
```

---

Lưu file này để tham khảo nhanh khi cần! 📖
