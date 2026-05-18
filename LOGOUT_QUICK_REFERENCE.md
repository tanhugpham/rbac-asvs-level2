# 🚀 LOGOUT - QUICK REFERENCE

## ⚡ QUICK START

```bash
# 1. Start server
npm run dev

# 2. Open browser
http://localhost:3000/login

# 3. Login and test logout
```

---

## 🎯 DEMO ACCOUNTS

```
ADMIN:    admin@example.com    / Admin@123456
STAFF:    staff@example.com    / Staff@123456
CUSTOMER: an.customer@example.com / Customer@123456
```

---

## 📍 LOGOUT BUTTON LOCATIONS

| Page | URL | Button Location |
|------|-----|-----------------|
| Admin Dashboard | `/admin/dashboard` | Top-right header |
| Staff Dashboard | `/staff/dashboard` | Top-right header |
| Attack Simulation | `/security/attack-simulation` | Top-right header |
| RBAC Matrix | `/security/rbac-matrix` | Top-right header |
| Authorization Flow | `/security/flow` | Top-right header |
| Security Analytics | `/security/analytics` | Top-right header |

---

## 🔍 EXPECTED BEHAVIOR

### 1. Click Logout
```
Button shows: "Đăng xuất" with 🚪 icon
```

### 2. Loading State
```
Button shows: "Đang đăng xuất..." with spinner
```

### 3. Redirect
```
URL changes to: /login
```

### 4. Console Logs
```
[LOGOUT] Starting logout...
[LOGOUT] Logout successful, redirecting to /login
```

### 5. Cookie Cleared
```
DevTools → Application → Cookies
auth-token = DELETED ✅
```

### 6. Protection
```
Try: /admin/dashboard
Result: Redirect to /login ✅
```

---

## ✅ QUICK TEST

```
1. Login ADMIN
2. Click "Đăng xuất"
3. See redirect to /login
4. Try /admin/dashboard
5. See redirect to /login
✅ PASS
```

---

## 🐛 QUICK DEBUG

### Button not showing?
```
Check: LogoutButton import and render
```

### Logout not working?
```
Check: Console logs for errors
Check: Network tab for API call
```

### Cookie not cleared?
```
Check: DevTools → Application → Cookies
Check: API response maxAge: 0
```

### Loading loop?
```
Check: router.push + router.refresh
Check: Middleware matcher
```

---

## 📝 FILES MODIFIED

```
NEW:
✅ src/components/LogoutButton.tsx

MODIFIED:
✅ src/components/dashboards/AdminDashboard.tsx
✅ src/components/dashboards/StaffDashboard.tsx
✅ src/app/security/attack-simulation/page.tsx
✅ src/components/security/RBACMatrix.tsx
✅ src/components/security/AuthorizationFlow.tsx
✅ src/app/security/analytics/page.tsx
```

---

## 🎯 DEMO SCRIPT (30 SECONDS)

```
1. "Mỗi dashboard có nút Đăng xuất ở góc phải trên"
2. Click logout → "Đang đăng xuất..."
3. Redirect về /login
4. "Cookie đã bị xóa, middleware chặn truy cập"
5. Try /admin/dashboard → redirect /login
✅ DONE
```

---

## 📚 FULL DOCUMENTATION

```
LOGOUT_FEATURE_COMPLETE.md     - Technical docs (English)
HUONG_DAN_TEST_LOGOUT.md       - Test guide (Vietnamese)
TONG_KET_LOGOUT.md             - Summary (Vietnamese)
LOGOUT_QUICK_REFERENCE.md      - This file
```

---

## ✅ STATUS

**COMPLETE** - Ready for demo! 🎉
