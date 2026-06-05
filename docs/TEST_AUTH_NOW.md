# 🧪 Test Authentication - Ngay Bây Giờ

## ✅ Fix Hoàn Thành

### Vấn đề đã fix:
- ❌ **Trước**: Login thành công → middleware báo `Authenticated: false` → redirect loop
- ✅ **Sau**: Login thành công → middleware báo `Authenticated: true` → vào dashboard

### Root causes đã fix:
1. ✅ Cookie name đồng bộ: `auth-token` (thay vì `auth_token`)
2. ✅ Middleware dùng `jose` library (Edge Runtime compatible)
3. ✅ Cookie settings đúng: `httpOnly`, `sameSite: lax`, `path: /`
4. ✅ Debug logs đầy đủ

---

## 🚀 Cách Test

### Bước 1: Clear Browser Data
**Quan trọng**: Xóa cookies cũ trước khi test!

```
1. Mở DevTools: F12
2. Application tab → Cookies → http://localhost:3000
3. Right-click → Clear (xóa tất cả cookies)
4. Application tab → Storage → Clear site data
5. Close DevTools
6. Hard refresh: Ctrl + Shift + R
```

### Bước 2: Test Staff Login

**Mở**: http://localhost:3000/login

**Click vào "Staff User"** hoặc nhập:
```
Email: staff@example.com
Password: Staff@123456
```

**Bấm "Đăng nhập"**

---

## 📊 Expected Results

### ✅ Server Console (Terminal)
```
[LOGIN API] Request received
[LOGIN API] Email: staff@example.com
[LOGIN API] User roles: ["STAFF"]
[LOGIN API] Redirect to: /staff/dashboard
[LOGIN API] Token created, setting cookie
[LOGIN API] Cookie set: auth-token
[LOGIN API] Success!
POST /api/auth/login 200

[MIDDLEWARE] Request: /staff/dashboard
[MIDDLEWARE] Token exists: true
[MIDDLEWARE] Token verified: true
[MIDDLEWARE] Authenticated: true
[MIDDLEWARE] User: staff@example.com
[MIDDLEWARE] Access granted

[AUTH] getCurrentUser called
[AUTH] Token valid, userId: xxx
[AUTH] User loaded: staff@example.com Roles: ["STAFF"]
[AUTH] requireRole called: STAFF
[AUTH] requireRole success

[STAFF DASHBOARD] Loading...
[STAFF DASHBOARD] User: staff@example.com Roles: ["STAFF"]
[STAFF DASHBOARD] Stats loaded: { totalProducts: 0, totalOrders: 0, pendingOrders: 0 }
```

### ✅ Browser
- URL changes to: `http://localhost:3000/staff/dashboard`
- Dashboard renders with stats
- No redirect loop
- No "Đang xác thực..." stuck

### ✅ Browser DevTools (F12)
**Console tab**:
```
[LOGIN] Login successful
[LOGIN] User roles: ["STAFF"]
[LOGIN] Redirect to: /staff/dashboard
[LOGIN] Redirecting to: /staff/dashboard
```

**Application tab → Cookies**:
```
Name: auth-token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Path: /
HttpOnly: ✓
Secure: (blank - because localhost)
SameSite: Lax
Expires: (7 days from now)
```

**Network tab**:
```
POST /api/auth/login
Status: 200 OK
Response Headers:
  Set-Cookie: auth-token=eyJ...; Path=/; HttpOnly; SameSite=Lax

GET /staff/dashboard
Status: 200 OK
Request Headers:
  Cookie: auth-token=eyJ...
```

---

## 🎯 Key Indicators of Success

### 1. Cookie Set Correctly
```
F12 → Application → Cookies → http://localhost:3000
```
- ✅ Cookie name: `auth-token` (NOT `auth_token`)
- ✅ HttpOnly: checked
- ✅ Path: `/`
- ✅ SameSite: `Lax`

### 2. Middleware Logs
```
[MIDDLEWARE] Token exists: true
[MIDDLEWARE] Token verified: true
[MIDDLEWARE] Authenticated: true
```

### 3. No Redirect Loop
- ✅ URL stays at `/staff/dashboard`
- ✅ No multiple redirects in Network tab
- ✅ Dashboard content visible

---

## 🧪 Additional Tests

### Test 2: Admin Login
```
Email: admin@example.com
Password: Admin@123456
Expected: Redirect to /admin/dashboard
```

### Test 3: Customer Login
```
Email: an.customer@example.com
Password: Customer@123456
Expected: Redirect to /account
```

### Test 4: Logout
```javascript
// In browser console:
fetch('/api/auth/logout', { method: 'POST' })
  .then(r => r.json())
  .then(data => {
    console.log(data);
    window.location.href = '/login';
  });
```

**Expected**:
- ✅ Cookie `auth-token` deleted
- ✅ Redirect to `/login`
- ✅ Cannot access `/staff/dashboard` anymore

### Test 5: Protected Route Without Login
```
1. Logout (or clear cookies)
2. Try to access: http://localhost:3000/staff/dashboard
```

**Expected**:
```
[MIDDLEWARE] Request: /staff/dashboard
[MIDDLEWARE] Token exists: false
[MIDDLEWARE] Authenticated: false
[MIDDLEWARE] Not authenticated, redirect to /login
```
- ✅ Redirects to `/login?redirect=/staff/dashboard`

---

## ❌ If Still Having Issues

### Issue 1: "Authenticated: false" in middleware
**Check**:
```bash
# 1. Cookie name in login API
grep "cookies.set" src/app/api/auth/login/route.ts
# Should show: auth-token

# 2. Cookie name in middleware
grep "AUTH_COOKIE_NAME" src/middleware.ts
# Should show: 'auth-token'

# 3. Cookie name in auth.ts
grep "AUTH_COOKIE_NAME" src/lib/auth.ts
# Should show: 'auth-token'
```

**Fix**: All must use `auth-token` (hyphen, not underscore)

### Issue 2: JWT verification fails
**Check server logs**:
```
[JWT EDGE] Verification failed: ...
```

**Possible causes**:
- JWT_SECRET not set in `.env`
- JWT_SECRET different between login and middleware
- Token format invalid

**Fix**:
```bash
# Check .env
cat .env | grep JWT_SECRET

# Should have:
JWT_SECRET=your-secret-key-here
```

### Issue 3: Cookie not set
**Check Network tab**:
```
POST /api/auth/login
Response Headers → Set-Cookie
```

**Should see**:
```
Set-Cookie: auth-token=eyJ...; Path=/; HttpOnly; SameSite=Lax
```

**If missing**:
- Check login API logs: `[LOGIN API] Cookie set: auth-token`
- Restart server: `Ctrl+C` then `npm run dev`

### Issue 4: Old cookie still exists
**Solution**:
```
1. F12 → Application → Cookies
2. Delete ALL cookies manually
3. Close browser completely
4. Reopen browser
5. Try login again
```

---

## 🔍 Debug Checklist

Before reporting issues, verify:

- [ ] Server running at http://localhost:3000
- [ ] `.env` file has `JWT_SECRET`
- [ ] All old cookies cleared
- [ ] Browser hard refreshed (Ctrl+Shift+R)
- [ ] Server logs show `[LOGIN API] Cookie set: auth-token`
- [ ] Middleware logs show `[MIDDLEWARE] Token exists: true`
- [ ] Middleware logs show `[MIDDLEWARE] Authenticated: true`
- [ ] Cookie name is `auth-token` (not `auth_token`)
- [ ] No TypeScript errors in terminal
- [ ] `jose` package installed (`npm list jose`)

---

## 📝 Summary of Changes

### Cookie Name
```diff
- auth_token (underscore)
+ auth-token (hyphen)
```

### JWT Library
```diff
Middleware:
- jsonwebtoken (doesn't work in Edge Runtime)
+ jose (Edge Runtime compatible)

API Routes:
  jsonwebtoken (still used, works fine)
```

### Cookie Method
```diff
- serialize() from 'cookie' package
- response.headers.set('Set-Cookie', cookie)
+ response.cookies.set('auth-token', token, {...})
```

### Files Modified
1. ✅ `src/lib/jwt-edge.ts` - NEW (jose for middleware)
2. ✅ `src/middleware.ts` - Use jose, cookie name, logs
3. ✅ `src/lib/auth.ts` - Cookie name
4. ✅ `src/app/api/auth/login/route.ts` - Cookie name, method
5. ✅ `src/app/api/auth/logout/route.ts` - Cookie name, method

---

## 🎉 Success!

Nếu bạn thấy:
- ✅ `[MIDDLEWARE] Authenticated: true`
- ✅ Dashboard renders
- ✅ Cookie `auth-token` exists
- ✅ No redirect loop

**Thì fix đã thành công!** 🚀

---

## 📞 Next Steps

1. Test all 3 user types (ADMIN, STAFF, CUSTOMER)
2. Test logout functionality
3. Test protected routes without login
4. Verify cookie security settings
5. Check audit logs in database

**Server đang chạy tại**: http://localhost:3000

**Test ngay!** 🧪
