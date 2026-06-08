# CI/CD Pipeline - RBAC ASVS Level 2

## Kiến trúc CI/CD: GitHub + Vercel Auto-Deploy

```
[Local Code] --> git push --> [GitHub Repository] --> [Vercel Auto Build & Deploy] --> [Production]
```

---

## 1. Các thành phần trong CI/CD Pipeline

### 1.1. File cấu hình CI/CD: `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npx prisma generate && next build",
  "installCommand": "npm install"
}
```

File này định nghĩa cho Vercel biết:
- **Framework**: Next.js
- **Install Command**: `npm install` - cài đặt dependencies
- **Build Command**: `npx prisma generate && next build`
  - `npx prisma generate`: Tạo Prisma Client từ schema để tương tác database
  - `next build`: Build Next.js application thành static files + serverless functions

### 1.2. GitHub Repository

- **Remote URL**: `https://github.com/tanhugpham/rbac-asvs-level2`
- **Branch chính**: `main`
- **Cơ chế**: Khi code được push lên GitHub, Vercel sẽ tự động nhận diện thay đổi qua webhook

### 1.3. Vercel Platform

- **Project**: RBAC ASVS Level 2 (Next.js App)
- **Region**: Tự động chọn gần user nhất (Vercel Edge Network)
- **Database**: PostgreSQL trên Render (VPS riêng, không nằm trong CI/CD pipeline)

---

## 2. Quy trình CI/CD (Tự động từ Commit → Deploy)

| Bước | Giai đoạn | Mô tả | Nơi thực thi |
|------|-----------|-------|-------------|
| 1 | **Continuous Integration (CI)** | Developer push code lên GitHub | Local → GitHub |
| 2 | **Trigger** | Vercel phát hiện code mới qua webhook | Vercel Server |
| 3 | **Install** | `npm install` - cài đặt tất cả dependencies | Vercel Build Server |
| 4 | **Generate** | `npx prisma generate` - tạo Prisma Client từ schema | Vercel Build Server |
| 5 | **Build** | `next build` - build Next.js application | Vercel Build Server |
| 6 | **Continuous Deployment (CD)** | Deploy artifact lên Vercel Edge Network | Vercel Edge Network |
| 7 | **Ready** | Production URL được cập nhật với code mới | Global CDN |

### Chi tiết từng bước:

#### Bước 1: Push Code lên GitHub (CI - Continuous Integration)
```bash
# Kiểm tra trạng thái file đã thay đổi
git status

# Thêm tất cả file vào staging area
git add -A

# Commit với message mô tả
git commit -m "Mô tả chi tiết những thay đổi"

# Push lên GitHub
git push origin main
```

#### Bước 2-3: Vercel Trigger + Install (CI)
- Vercel nhận webhook từ GitHub
- Tạo môi trường build server (Linux container)
- Clone repository về build server
- Chạy `npm install` để cài dependencies từ `package.json` và `package-lock.json`

#### Bước 4: Generate Prisma Client (CI)
```bash
npx prisma generate
```
- Đọc file `prisma/schema.prisma`
- Sinh ra Prisma Client (TypeScript types + query engine)
- Client này được sử dụng trong toàn bộ ứng dụng để truy vấn database

#### Bước 5: Build Next.js (CI)
```bash
next build
```
- Compile TypeScript thành JavaScript
- Optimize images, fonts
- Tạo static pages và serverless functions
- Generate `.next/` directory (build output)

#### Bước 6-7: Deploy lên Production (CD - Continuous Deployment)
- Upload build artifacts lên Vercel Edge Network
- Cập nhật routing configuration
- CDN cache được làm mới
- Production URL (VD: `https://rbac-asvs-level2.vercel.app`) được cập nhật

---

## 3. Git Workflow - Các lệnh cơ bản

### 3.1. Clone repository lần đầu
```bash
git clone https://github.com/tanhugpham/rbac-asvs-level2.git
cd Demo
```

### 3.2. Kiểm tra trạng thái
```bash
# Xem các file đã thay đổi
git status

# Xem lịch sử commit
git log --oneline
```

### 3.3. Push code mới lên GitHub
```bash
# Bước 1: Xem thay đổi
git status

# Bước 2: Thêm file vào staging
git add -A          # Thêm tất cả file
# hoặc
git add src/        # Chỉ thêm file trong thư mục src/
# hoặc
git add file1.ts file2.ts  # Chỉ thêm file cụ thể

# Bước 3: Commit
git commit -m "feat: thêm tính năng mới"

# Bước 4: Push lên GitHub
git push origin main
```

### 3.4. Pull code mới nhất từ GitHub
```bash
git pull origin main
```

---

## 4. Cách kiểm tra CI/CD đã hoạt động

### 4.1. Xem trên Vercel Dashboard (Quan trọng nhất)

Truy cập [https://vercel.com](https://vercel.com) → Chọn project `rbac-asvs-level2` → Tab **Deployments**

Mỗi lần push code lên GitHub sẽ có một deployment tương ứng:
```
dd53547  ✅ Ready   Production  https://rbac-asvs-level2.vercel.app   ~2 phút trước
74bdc88  ✅ Ready   Production  https://rbac-asvs-level2.vercel.app   ~10 phút trước
d95f8ae  ✅ Ready   Production  https://rbac-asvs-level2.vercel.app   ~1 giờ trước
```

Trạng thái build:
- ⏳ **Building**: Đang build
- ✅ **Ready**: Deploy thành công
- ❌ **Error**: Build thất bại (cần kiểm tra logs)

### 4.2. Xem trên GitHub
```bash
# Xem lịch sử commit local
git log --oneline
```
Output:
```
dd53547 chore: add vercel.json for Vercel deployment config and .env.example template
74bdc88 feat: update source code - migrate docs to docs/ folder, add new features (AddProductModal, BuyNowModal), update RBAC system, fix security, improve UI
d95f8ae fix: Add force-dynamic and Suspense for Vercel build
```

Hoặc lên GitHub UI: `https://github.com/tanhugpham/rbac-asvs-level2/commits/main`

### 4.3. Xem build logs trên Vercel
- Vào Vercel Dashboard → Deployment → Chọn một deployment → Tab **Logs**
- Xem runtime logs, build errors, serverless function logs

---

## 5. Cấu hình môi trường (Environment Variables)

Các biến môi trường được cấu hình thủ công trên Vercel Dashboard (Settings → Environment Variables):

| Variable | Mô tả | Ví dụ |
|----------|-------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key cho JWT token | (64 ký tự hex) |
| `NODE_ENV` | Môi trường | `production` |
| `NEXT_PUBLIC_APP_URL` | URL production | `https://rbac-asvs-level2.vercel.app` |
| `ADMIN_EMAIL` | Email admin mặc định | `admin@example.com` |
| `ADMIN_PASSWORD` | Password admin | (đã hash) |
| `ADMIN_NAME` | Tên admin | `System Administrator` |

Lưu ý: File `.env` không được push lên GitHub (đã có trong `.gitignore`). Chỉ có `.env.example` được push làm template.

---

## 6. Database (Ngoài CI/CD Pipeline)

Database PostgreSQL được host riêng trên Render (không phải Vercel):
- **Host**: `dpg-d858pt7aqgkc73b5n5kg-a.singapore-postgres.render.com`
- **Lý do**: Vercel không hỗ trợ PostgreSQL built-in, cần database external
- **Seed data**: Chạy thủ công khi cần:
  ```bash
  npm run prisma:seed
  ```

---

## 7. Tổng kết

### Luồng CI/CD hoàn chỉnh:

```
[Developer]
    |
    | git add -A
    | git commit -m "..."
    | git push origin main
    v
[GitHub Repository] ─── webhook ───> [Vercel Build Server]
                                         |
                                         | npm install
                                         | npx prisma generate
                                         | next build
                                         v
                                    Build thành công?
                                    /              \
                                  Yes              No ──> Báo lỗi
                                   |
                                   v
                          [Vercel Edge Network]
                                   |
                                   | Deploy production
                                   v
                          [https://....vercel.app]
```

### Lợi ích:
- ✅ **Tự động hóa**: Không cần manual deploy
- ✅ **Nhanh chóng**: Deploy trong ~2-5 phút
- ✅ **Rollback dễ dàng**: Có thể rollback bất kỳ deployment nào
- ✅ **Preview Deployments**: Tự động tạo preview URL cho mỗi Pull Request
- ✅ **Zero Downtime**: Vercel dùng incremental deployment
- ✅ **Tích hợp GitHub**: Mỗi commit = một deployment

---

*Tài liệu này mô tả CI/CD Pipeline của dự án RBAC ASVS Level 2 - Hệ thống quản lý phân quyền người dùng với Next.js, Prisma, PostgreSQL trên Vercel.*