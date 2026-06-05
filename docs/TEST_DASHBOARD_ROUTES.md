# 🧪 TEST DASHBOARD ROUTES FIX

## 🎯 MỤC TIÊU

Test fix lỗi 404 khi bấm "Back to Dashboard" từ security pages.

---

## ✅ TEST CASE 1: ADMIN Back to Dashboard

### Bước 1: Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

### Bước 2: Navigate to Security Page
```
URL: http://localhost:3000/security/attack-simulation
```

### Bước 3: Click "Back to Dashboard"
- Tìm link "← Back to Dashboard" ở góc trái trên
- Click vào link

### Bước 4: Verify Redirect
```
Expected URL: /admin/dashboard ✅
NOT: /dashboard/admin ❌
```

### Bước 5: Check Console
```
No 404 errors ✅
Page loads successfully ✅
```

**✅ PASS nếu redirect đúng và không có 404**

---

## ✅ TEST CASE 2: Login Redirect - ADMIN

### Bước 1: Logout (nếu đang login)

### Bước 2: Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

### Bước 3: Check Console Logs
```
Expected:
[LOGIN API] Redirect to: /admin/dashboard ✅

NOT:
[LOGIN API] Redirect to: /dashboard/admin ❌
```

### Bước 4: Verify URL
```
Current URL: /admin/dashboard ✅
```

**✅ PASS nếu redirect đúng**

---

## ✅ TEST CASE 3: Login Redirect - STAFF

### Bước 1: Logout

### Bước 2: Login STAFF
```
Email: staff@example.com
Password: Staff@123456
```

### Bước 3: Check Console Logs
```
Expected:
[LOGIN API] Redirect to: /staff/dashboard ✅

NOT:
[LOGIN API] Redirect to: /dashboard/staff ❌
```

### Bước 4: Verify URL
```
Current URL: /staff/dashboard ✅
```

**✅ PASS nếu redirect đúng**

---

## ✅ TEST CASE 4: Login Redirect - CUSTOMER

### Bước 1: Logout

### Bước 2: Login CUSTOMER
```
Email: an.customer@example.com
Password: Customer@123456
```

### Bước 3: Check Console Logs
```
Expected:
[LOGIN API] Redirect to: /account ✅

NOT:
[LOGIN API] Redirect to: /dashboard/customer ❌
```

### Bước 4: Verify URL
```
Current URL: /account ✅
```

**✅ PASS nếu redirect đúng**

---

## ✅ TEST CASE 5: Account Page Redirect

### Bước 1: Login ADMIN

### Bước 2: Navigate to /account
```
URL: http://localhost:3000/account
```

### Bước 3: Verify Auto-Redirect
```
Should redirect to: /admin/dashboard ✅
NOT: /dashboard/admin ❌
```

### Bước 4: Test with STAFF
```
1. Logout
2. Login STAFF
3. Go to /account
4. Should redirect to: /staff/dashboard ✅
```

**✅ PASS nếu redirect đúng cho cả 2 roles**

---

## ✅ TEST CASE 6: No 404 Errors

### Bước 1: Open DevTools
```
Press F12
Go to Console tab
```

### Bước 2: Clear Console
```
Click "Clear console" icon
```

### Bước 3: Login ADMIN và Navigate
```
1. Login ADMIN
2. Go to /security/attack-simulation
3. Click "Back to Dashboard"
```

### Bước 4: Check Console
```
Should NOT see:
❌ GET /dashboard/admin 404 Not Found

Should see:
✅ No 404 errors
✅ Page loads successfully
```

**✅ PASS nếu không có 404 errors**

---

## 📊 TEST RESULTS TABLE

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| ADMIN Back to Dashboard | /admin/dashboard | | ⬜ |
| ADMIN Login Redirect | /admin/dashboard | | ⬜ |
| STAFF Login Redirect | /staff/dashboard | | ⬜ |
| CUSTOMER Login Redirect | /account | | ⬜ |
| Account Page Redirect | Correct dashboard | | ⬜ |
| No 404 Errors | No errors | | ⬜ |

**Điền ✅ vào cột Status khi test pass**

---

## 🔍 DEBUGGING

### If Still Getting 404:

**1. Check Route:**
```
Open browser DevTools → Network tab
Look for the failed request
Check the URL being requested
```

**2. Check Console Logs:**
```
[LOGIN API] Redirect to: ???
Should be /admin/dashboard, not /dashboard/admin
```

**3. Clear Cache:**
```bash
# Stop server
Ctrl+C

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

**4. Check Helper Function:**
```typescript
// src/lib/dashboard-routes.ts
getDashboardPath(ROLES.ADMIN) // Should return '/admin/dashboard'
```

---

## 🎯 CORRECT ROUTES

| Role | Correct Route | Wrong Route |
|------|---------------|-------------|
| ADMIN | `/admin/dashboard` ✅ | `/dashboard/admin` ❌ |
| STAFF | `/staff/dashboard` ✅ | `/dashboard/staff` ❌ |
| CUSTOMER | `/account` ✅ | `/dashboard/customer` ❌ |

---

## 🎨 VISUAL CHECK

### ADMIN Dashboard URL Bar:
```
✅ localhost:3000/admin/dashboard
❌ localhost:3000/dashboard/admin
```

### STAFF Dashboard URL Bar:
```
✅ localhost:3000/staff/dashboard
❌ localhost:3000/dashboard/staff
```

### CUSTOMER Account URL Bar:
```
✅ localhost:3000/account
❌ localhost:3000/dashboard/customer
```

---

## 🚀 QUICK TEST SCRIPT

```bash
# 1. Start server
npm run dev

# 2. Open browser
http://localhost:3000/login

# 3. Test ADMIN
- Login ADMIN
- Go to /security/attack-simulation
- Click "Back to Dashboard"
- Check URL: /admin/dashboard ✅

# 4. Test STAFF
- Logout
- Login STAFF
- Check URL: /staff/dashboard ✅

# 5. Test CUSTOMER
- Logout
- Login CUSTOMER
- Check URL: /account ✅

# 6. Check Console
- No 404 errors ✅
```

---

## ✅ SUCCESS CRITERIA

All tests pass if:

1. ✅ ADMIN redirects to `/admin/dashboard`
2. ✅ STAFF redirects to `/staff/dashboard`
3. ✅ CUSTOMER redirects to `/account`
4. ✅ No 404 errors in console
5. ✅ "Back to Dashboard" works correctly
6. ✅ Login API returns correct redirectTo

---

## 🎉 EXPECTED RESULT

After fix:

✅ No more `/dashboard/admin` 404 errors  
✅ All redirects use correct routes  
✅ Helper function works correctly  
✅ Type-safe route management  
✅ Easy to maintain  

**Ready to demo! 🚀**
