# 🧪 TEST CUSTOMER ACCOUNT

## 🎯 MỤC TIÊU

Test fix lỗi CUSTOMER không vào được /account dashboard.

---

## ✅ TEST CASE 1: CUSTOMER LOGIN

### Bước 1: Start Server
```bash
npm run dev
```

### Bước 2: Open Browser
```
http://localhost:3000/login
```

### Bước 3: Login CUSTOMER
```
Email: an.customer@example.com
Password: Customer@123456
```

### Bước 4: Verify Redirect
```
Expected URL: /account ✅
NOT: blank screen ❌
NOT: redirect loop ❌
```

### Bước 5: Verify Dashboard
```
Should see:
✅ "Xin chào, An Customer" (or user name)
✅ Stats cards: My Orders, Purchased Accounts, Wallet Balance
✅ Access Level notice (blue card)
✅ Quick Actions: Orders, Profile, Security, Support
✅ Logout button (top-right)
✅ OWASP ASVS badge (bottom)
```

### Bước 6: Check Console
```
Expected logs:
[LOGIN API] User roles: ['CUSTOMER']
[LOGIN API] Redirect to: /account
[ACCOUNT PAGE] Loading...
[ACCOUNT PAGE] User: an.customer@example.com Roles: ['CUSTOMER']
[ACCOUNT PAGE] CUSTOMER detected, showing account dashboard
[ACCOUNT PAGE] Stats loaded: {...}

No errors ✅
No redirect loop ✅
```

**✅ PASS nếu dashboard hiển thị đúng**

---

## ✅ TEST CASE 2: CUSTOMER SUB-PAGES

### Test My Orders:

**Bước 1:** Click "My Orders" card hoặc quick action

**Bước 2:** Verify URL
```
Expected: /account/orders ✅
```

**Bước 3:** Verify Page
```
Should see:
✅ "My Orders" title
✅ "Back to Account" link
✅ Logout button
✅ Order list OR empty state
✅ If empty: "No Orders Yet" message
```

---

### Test Profile:

**Bước 1:** Back to /account, click "Profile Settings"

**Bước 2:** Verify URL
```
Expected: /account/profile ✅
```

**Bước 3:** Verify Page
```
Should see:
✅ "Profile Settings" title
✅ User info: Name, Email, Role, Permissions
✅ "Back to Account" link
✅ Logout button
```

---

### Test Security:

**Bước 1:** Back to /account, click "Security"

**Bước 2:** Verify URL
```
Expected: /account/security ✅
```

**Bước 3:** Verify Page
```
Should see:
✅ "Security Settings" title
✅ Change Password option
✅ Enable 2FA option
✅ OWASP ASVS badge
✅ Security tips
✅ "Back to Account" link
✅ Logout button
```

---

### Test Support:

**Bước 1:** Back to /account, click "Support"

**Bước 2:** Verify URL
```
Expected: /account/support ✅
```

**Bước 3:** Verify Page
```
Should see:
✅ "Support" title
✅ Contact info (email, phone)
✅ Support hours
✅ FAQ section
✅ "Back to Account" link
✅ Logout button
```

**✅ PASS nếu tất cả sub-pages hoạt động**

---

## ✅ TEST CASE 3: CUSTOMER ACCESS DENIED

### Test Admin Dashboard:

**Bước 1:** Login CUSTOMER (nếu chưa)

**Bước 2:** Navigate to /admin/dashboard
```
Type in URL bar: http://localhost:3000/admin/dashboard
```

**Bước 3:** Verify Redirect
```
Expected: Redirect to /403 ✅
Should see: "Access Denied" page
```

**Bước 4:** Check Console
```
Expected logs:
[ADMIN DASHBOARD] Loading...
[ADMIN DASHBOARD] Error: Permission denied
Redirect to /403
```

---

### Test Staff Dashboard:

**Bước 1:** Navigate to /staff/dashboard

**Bước 2:** Verify Redirect
```
Expected: Redirect to /403 ✅
```

---

### Test Security Pages:

**Bước 1:** Navigate to /security/rbac-matrix

**Bước 2:** Verify Redirect
```
Expected: Redirect to /403 ✅
```

**Bước 3:** Try /security/attack-simulation

**Bước 4:** Verify Redirect
```
Expected: Redirect to /403 ✅
```

**✅ PASS nếu tất cả đều redirect 403**

---

## ✅ TEST CASE 4: ADMIN/STAFF UNCHANGED

### Test ADMIN:

**Bước 1:** Logout CUSTOMER

**Bước 2:** Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

**Bước 3:** Verify Redirect
```
Expected: /admin/dashboard ✅
NOT: /account ❌
```

**Bước 4:** Verify Dashboard
```
Should see: Admin Dashboard ✅
```

---

### Test STAFF:

**Bước 1:** Logout ADMIN

**Bước 2:** Login STAFF
```
Email: staff@example.com
Password: Staff@123456
```

**Bước 3:** Verify Redirect
```
Expected: /staff/dashboard ✅
NOT: /account ❌
```

**Bước 4:** Verify Dashboard
```
Should see: Staff Dashboard ✅
```

**✅ PASS nếu ADMIN/STAFF flow không bị ảnh hưởng**

---

## ✅ TEST CASE 5: NO BLANK SCREEN

### Bước 1: Login CUSTOMER

### Bước 2: Verify No Blank Screen
```
✅ Dashboard renders immediately
✅ No white/black blank screen
✅ No loading forever
✅ No redirect loop
```

### Bước 3: Check DevTools Console
```
✅ No RedirectBoundary errors
✅ No NotFoundBoundary errors
✅ No ErrorBoundary errors
✅ Only normal logs
```

### Bước 4: Check Network Tab
```
✅ /account returns 200 OK
✅ No infinite redirects
✅ No 404 errors
```

**✅ PASS nếu không có blank screen**

---

## 📊 TEST RESULTS TABLE

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| CUSTOMER Login | /account dashboard | | ⬜ |
| My Orders Page | /account/orders | | ⬜ |
| Profile Page | /account/profile | | ⬜ |
| Security Page | /account/security | | ⬜ |
| Support Page | /account/support | | ⬜ |
| Admin Access Denied | /403 | | ⬜ |
| Staff Access Denied | /403 | | ⬜ |
| Security Access Denied | /403 | | ⬜ |
| ADMIN Flow | /admin/dashboard | | ⬜ |
| STAFF Flow | /staff/dashboard | | ⬜ |
| No Blank Screen | Dashboard renders | | ⬜ |

**Điền ✅ vào cột Status khi test pass**

---

## 🐛 DEBUGGING

### If Blank Screen:

**1. Check Console:**
```
Look for errors:
- RedirectBoundary
- NotFoundBoundary
- ErrorBoundary
```

**2. Check Network Tab:**
```
Look for:
- Infinite redirects
- 404 errors
- Failed requests
```

**3. Check URL:**
```
Is it stuck on /account?
Is it redirecting in loop?
```

**4. Clear Cache:**
```bash
# Stop server
Ctrl+C

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

---

### If 403 Not Working:

**1. Check Middleware:**
```
src/middleware.ts
Should have /security in PROTECTED_ROUTES
```

**2. Check Auth:**
```
Is user logged in?
Check cookie: auth-token
```

**3. Check Permissions:**
```
CUSTOMER should NOT have admin permissions
Check user.permissions in console
```

---

## 🎯 QUICK TEST SCRIPT

```bash
# 1. Start server
npm run dev

# 2. Test CUSTOMER
Login: an.customer@example.com / Customer@123456
Check: /account dashboard renders ✅
Check: No blank screen ✅

# 3. Test Sub-Pages
Click: My Orders → /account/orders ✅
Click: Profile → /account/profile ✅
Click: Security → /account/security ✅
Click: Support → /account/support ✅

# 4. Test Access Denied
Try: /admin/dashboard → /403 ✅
Try: /staff/dashboard → /403 ✅
Try: /security/rbac-matrix → /403 ✅

# 5. Test ADMIN/STAFF
Login ADMIN → /admin/dashboard ✅
Login STAFF → /staff/dashboard ✅
```

---

## ✅ SUCCESS CRITERIA

All tests pass if:

1. ✅ CUSTOMER can access /account dashboard
2. ✅ Dashboard renders (no blank screen)
3. ✅ No redirect loop
4. ✅ All sub-pages work
5. ✅ CUSTOMER denied /admin, /staff, /security
6. ✅ ADMIN/STAFF flow unchanged
7. ✅ No console errors
8. ✅ Beautiful UI

---

## 🎉 EXPECTED RESULT

After fix:

✅ CUSTOMER login → /account dashboard  
✅ Beautiful UI with stats and actions  
✅ No blank screen  
✅ No redirect loop  
✅ Proper access control  
✅ ADMIN/STAFF unchanged  

**Ready to demo! 🚀**
