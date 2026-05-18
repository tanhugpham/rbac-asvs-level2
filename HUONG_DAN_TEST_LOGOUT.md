# 🧪 HƯỚNG DẪN TEST LOGOUT

## 🎯 MỤC TIÊU

Test chức năng **Logout** cho toàn bộ hệ thống RBAC.

---

## 📋 CHUẨN BỊ

### 1. Start Server
```bash
npm run dev
```

### 2. Mở Browser
```
http://localhost:3000/login
```

### 3. Mở DevTools
- Press `F12`
- Tab **Console** (xem logs)
- Tab **Application → Cookies** (xem cookie)

---

## ✅ TEST CASE 1: ADMIN LOGOUT

### Bước 1: Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

### Bước 2: Kiểm tra Dashboard
- URL: `http://localhost:3000/admin/dashboard`
- Thấy nút **"Đăng xuất"** ở góc phải trên ✅
- Nút có icon 🚪 và text "Đăng xuất" ✅

### Bước 3: Click Logout
- Click nút **"Đăng xuất"**
- Thấy loading state: "Đang đăng xuất..." ✅
- Console log:
  ```
  [LOGOUT] Starting logout...
  [LOGOUT] Logout successful, redirecting to /login
  ```

### Bước 4: Verify Redirect
- URL tự động chuyển về: `http://localhost:3000/login` ✅
- Thấy trang login ✅

### Bước 5: Verify Cookie Cleared
- DevTools → Application → Cookies
- Cookie `auth-token` đã bị xóa ✅

### Bước 6: Verify Protection
- Thử truy cập: `http://localhost:3000/admin/dashboard`
- Tự động redirect về `/login` ✅
- Console log:
  ```
  [MIDDLEWARE] No token found, redirecting to /login
  ```

**✅ PASS nếu tất cả các bước đều đúng**

---

## ✅ TEST CASE 2: STAFF LOGOUT

### Bước 1: Login STAFF
```
Email: staff@example.com
Password: Staff@123456
```

### Bước 2: Kiểm tra Dashboard
- URL: `http://localhost:3000/staff/dashboard`
- Thấy nút **"Đăng xuất"** ở góc phải trên ✅

### Bước 3: Click Logout
- Click nút **"Đăng xuất"**
- Thấy loading state ✅
- Console log:
  ```
  [LOGOUT] Starting logout...
  [LOGOUT] Logout successful, redirecting to /login
  ```

### Bước 4: Verify Redirect
- URL: `http://localhost:3000/login` ✅

### Bước 5: Verify Protection
- Thử truy cập: `http://localhost:3000/staff/dashboard`
- Redirect về `/login` ✅

**✅ PASS nếu tất cả các bước đều đúng**

---

## ✅ TEST CASE 3: SECURITY PAGES LOGOUT

### Bước 1: Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

### Bước 2: Test Attack Simulation Page
- Navigate: `http://localhost:3000/security/attack-simulation`
- Thấy nút **"Đăng xuất"** ở góc phải trên ✅
- Click logout
- Redirect về `/login` ✅

### Bước 3: Login lại ADMIN

### Bước 4: Test RBAC Matrix Page
- Navigate: `http://localhost:3000/security/rbac-matrix`
- Thấy nút **"Đăng xuất"** ✅
- Click logout
- Redirect về `/login` ✅

### Bước 5: Login lại ADMIN

### Bước 6: Test Authorization Flow Page
- Navigate: `http://localhost:3000/security/flow`
- Thấy nút **"Đăng xuất"** ✅
- Click logout
- Redirect về `/login` ✅

### Bước 7: Login lại ADMIN

### Bước 8: Test Security Analytics Page
- Navigate: `http://localhost:3000/security/analytics`
- Thấy nút **"Đăng xuất"** ✅
- Click logout
- Redirect về `/login` ✅

**✅ PASS nếu tất cả security pages đều có logout button**

---

## ✅ TEST CASE 4: NO LOADING LOOP

### Mục tiêu
Verify không bị infinite loading loop.

### Bước 1: Login ADMIN

### Bước 2: Click Logout
- Thấy loading state: "Đang đăng xuất..."
- Loading state **KHÔNG** bị stuck ✅
- Sau 1-2 giây, redirect về `/login` ✅

### Bước 3: Verify No Loop
- Trang `/login` load bình thường ✅
- Không bị redirect lại ✅
- Không bị loading vô hạn ✅

**✅ PASS nếu không có loading loop**

---

## ✅ TEST CASE 5: ERROR HANDLING

### Scenario: API Error

### Bước 1: Simulate API Error
- Tắt server: `Ctrl+C` trong terminal
- Hoặc block network trong DevTools

### Bước 2: Click Logout
- Thấy alert: "Logout failed. Please try again." ✅
- Console log:
  ```
  [LOGOUT] Error: <error message>
  ```

### Bước 3: Verify Button State
- Button không bị stuck ở loading state ✅
- Có thể click lại ✅

**✅ PASS nếu error được handle đúng**

---

## 🎨 UI/UX CHECKLIST

### Button Appearance
- ✅ Icon: LogOut từ lucide-react
- ✅ Text: "Đăng xuất"
- ✅ Color: Red (#ef4444)
- ✅ Border: Red border
- ✅ Background: Red/10 opacity

### Hover Effect
- ✅ Scale: 1.02
- ✅ Background: Lighter red
- ✅ Smooth transition

### Loading State
- ✅ Spinner animation
- ✅ Text: "Đang đăng xuất..."
- ✅ Button disabled

### Disabled State
- ✅ Cursor: not-allowed
- ✅ Opacity: 0.5

---

## 📊 TEST RESULTS TABLE

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| ADMIN Logout | Redirect to /login | | ⬜ |
| STAFF Logout | Redirect to /login | | ⬜ |
| Security Pages Logout | All have button | | ⬜ |
| No Loading Loop | Clean redirect | | ⬜ |
| Error Handling | Show alert | | ⬜ |
| Cookie Cleared | auth-token removed | | ⬜ |
| Middleware Protection | Block access | | ⬜ |
| Console Logs | Show logs | | ⬜ |

**Điền ✅ vào cột Status khi test pass**

---

## 🐛 COMMON ISSUES

### Issue 1: Button không hiển thị
**Solution:**
- Check import: `import { LogoutButton } from '@/components/LogoutButton';`
- Check component render: `<LogoutButton variant="default" />`

### Issue 2: Logout không redirect
**Solution:**
- Check API endpoint: `POST /api/auth/logout`
- Check cookie name: `auth-token` (hyphen, not underscore)
- Check middleware: `src/middleware.ts`

### Issue 3: Loading loop
**Solution:**
- Check `router.push('/login')` + `router.refresh()`
- Check middleware matcher excludes `/login`

### Issue 4: Cookie không bị xóa
**Solution:**
- Check API response: `maxAge: 0`
- Check cookie path: `path: '/'`
- Check DevTools → Application → Cookies

---

## 🎯 DEMO SCRIPT

### Khi demo cho giảng viên:

**1. Giới thiệu:**
```
"Hệ thống có chức năng Logout đầy đủ cho tất cả các dashboard và security pages."
```

**2. Show Button:**
```
"Mỗi trang đều có nút Đăng xuất ở góc phải trên, 
với icon và text rõ ràng."
```

**3. Demo Logout:**
```
"Khi bấm Đăng xuất:
1. Hệ thống gọi API /api/auth/logout
2. Xóa cookie auth-token
3. Redirect về trang login
4. Middleware chặn truy cập trái phép"
```

**4. Show Console:**
```
"Console logs cho thấy quá trình logout:
[LOGOUT] Starting logout...
[LOGOUT] Logout successful, redirecting to /login"
```

**5. Verify Protection:**
```
"Sau khi logout, nếu cố truy cập protected routes,
middleware sẽ tự động redirect về login."
```

---

## ✅ FINAL CHECKLIST

Trước khi demo:

- [ ] Server đang chạy (`npm run dev`)
- [ ] Database có demo accounts
- [ ] Browser DevTools mở sẵn
- [ ] Test tất cả 3 roles (ADMIN, STAFF, CUSTOMER)
- [ ] Verify logout button trên tất cả pages
- [ ] Verify middleware protection
- [ ] Verify console logs
- [ ] Verify cookie cleared

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi test xong:

✅ Tất cả dashboards có logout button  
✅ Tất cả security pages có logout button  
✅ Logout redirect về /login  
✅ Cookie được xóa  
✅ Middleware chặn truy cập  
✅ Không có loading loop  
✅ Error handling hoạt động  
✅ Console logs rõ ràng  
✅ UI/UX đẹp và smooth  

**Sẵn sàng demo! 🚀**
