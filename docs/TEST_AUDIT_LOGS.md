# 🧪 TEST AUDIT LOGS

## 🎯 MỤC TIÊU

Test fix hydration error và redesign audit logs page.

---

## ✅ TEST CASE 1: NO HYDRATION ERROR

### Bước 1: Start Server
```bash
npm run dev
```

### Bước 2: Login ADMIN
```
Email: admin@example.com
Password: Admin@123456
```

### Bước 3: Navigate to Audit Logs
```
URL: http://localhost:3000/admin/audit-logs
```

### Bước 4: Open DevTools Console
```
Press F12
Go to Console tab
```

### Bước 5: Check for Errors
```
Should NOT see:
❌ "Hydration failed because the initial UI does not match..."
❌ "Text content does not match server-rendered HTML"
❌ Any hydration warnings

Should see:
✅ No errors
✅ Clean console
✅ Only normal logs
```

### Bước 6: Refresh Page
```
Press Ctrl+R or F5
Check console again
Still no hydration errors ✅
```

**✅ PASS nếu không có hydration errors**

---

## ✅ TEST CASE 2: BEAUTIFUL UI

### Test Header:

**Bước 1:** Check title
```
Should see:
✅ "Audit Logs" (large, bold, white)
✅ "Theo dõi đăng nhập, truy cập bị từ chối và hành vi nhạy cảm"
```

**Bước 2:** Check buttons
```
Should see:
✅ "← Back to Dashboard" link (top-left)
✅ "Đăng xuất" button (top-right, red)
```

**Bước 3:** Click Back to Dashboard
```
Should redirect to: /admin/dashboard ✅
```

---

### Test Security Explanation Card:

**Bước 1:** Navigate back to /admin/audit-logs

**Bước 2:** Check blue card
```
Should see:
✅ Blue card with shield icon
✅ "OWASP ASVS Level 2 Compliance" title
✅ Explanation text about audit logs
```

---

### Test Stats Cards:

**Bước 1:** Check 4 stats cards
```
Should see:
✅ Total Logs (blue, FileText icon)
✅ Success (green, CheckCircle icon)
✅ Denied (red, XCircle icon)
✅ Attacks (orange, Zap icon)
```

**Bước 2:** Check numbers
```
Numbers should match actual log counts ✅
```

---

### Test Filters:

**Bước 1:** Check search box
```
Should see:
✅ Search icon on left
✅ Placeholder: "Search by email, action, or resource..."
✅ Full width input
```

**Bước 2:** Check dropdowns
```
Should see:
✅ Filter icon
✅ "All Status" dropdown
✅ "All Actions" dropdown
```

**Bước 3:** Check results count
```
Should see:
✅ "Showing X of Y logs" text
```

---

### Test Table:

**Bước 1:** Check table structure
```
Should see:
✅ Full width table
✅ Proper spacing (not dính mép trái)
✅ 7 columns: Time, User, Action, Resource, Permission, Status, IP Address
```

**Bước 2:** Check badges
```
Action badges should have:
✅ Icons (LogIn, LogOut, Lock, Zap, etc.)
✅ Colors (blue, purple, red, orange)
✅ Rounded style

Status badges should have:
✅ Icons (CheckCircle, XCircle, AlertTriangle)
✅ Colors (green, red, yellow, orange)
✅ Border
```

**Bước 3:** Check hover effect
```
Hover over table row:
✅ Background changes (lighter)
✅ Smooth transition
```

**Bước 4:** Check animations
```
Table rows should:
✅ Fade in from left
✅ Staggered animation (one by one)
```

**✅ PASS nếu UI đẹp và đầy đủ features**

---

## ✅ TEST CASE 3: SEARCH FUNCTIONALITY

### Test Search by Email:

**Bước 1:** Type "admin" in search box

**Bước 2:** Verify results
```
Should show:
✅ Only logs with "admin" in email
✅ Results count updated
```

**Bước 3:** Clear search
```
Delete text
Should show: All logs ✅
```

---

### Test Search by Action:

**Bước 1:** Type "LOGIN" in search box

**Bước 2:** Verify results
```
Should show:
✅ Only logs with "LOGIN" in action
```

---

### Test Search by Resource:

**Bước 1:** Type "/admin" in search box

**Bước 2:** Verify results
```
Should show:
✅ Only logs with "/admin" in resource
```

**✅ PASS nếu search hoạt động đúng**

---

## ✅ TEST CASE 4: FILTER FUNCTIONALITY

### Test Status Filter:

**Bước 1:** Select "Success" from status dropdown

**Bước 2:** Verify results
```
Should show:
✅ Only logs with status "SUCCESS"
✅ Green badges only
✅ Results count updated
```

**Bước 3:** Select "Denied"

**Bước 4:** Verify results
```
Should show:
✅ Only logs with status "DENIED"
✅ Red badges only
```

**Bước 5:** Select "All Status"
```
Should show: All logs ✅
```

---

### Test Action Filter:

**Bước 1:** Select "LOGIN" from action dropdown

**Bước 2:** Verify results
```
Should show:
✅ Only logs with action "LOGIN"
✅ Blue badges with LogIn icon
```

**Bước 3:** Select "LOGOUT"

**Bước 4:** Verify results
```
Should show:
✅ Only logs with action "LOGOUT"
✅ Purple badges with LogOut icon
```

---

### Test Combined Filters:

**Bước 1:** Search "admin" + Status "SUCCESS"

**Bước 2:** Verify results
```
Should show:
✅ Only logs matching BOTH filters
✅ Results count correct
```

**✅ PASS nếu filters hoạt động đúng**

---

## ✅ TEST CASE 5: RBAC PROTECTION

### Test STAFF Access:

**Bước 1:** Logout ADMIN

**Bước 2:** Login STAFF
```
Email: staff@example.com
Password: Staff@123456
```

**Bước 3:** Navigate to /admin/audit-logs
```
Type in URL bar: http://localhost:3000/admin/audit-logs
```

**Bước 4:** Verify Redirect
```
Should redirect to: /403 ✅
Should see: "Access Denied" page ✅
```

---

### Test CUSTOMER Access:

**Bước 1:** Logout STAFF

**Bước 2:** Login CUSTOMER
```
Email: an.customer@example.com
Password: Customer@123456
```

**Bước 3:** Navigate to /admin/audit-logs

**Bước 4:** Verify Redirect
```
Should redirect to: /403 ✅
```

**✅ PASS nếu STAFF/CUSTOMER bị chặn**

---

## ✅ TEST CASE 6: LOGS CREATED

### Test Login Log:

**Bước 1:** Logout

**Bước 2:** Login ADMIN

**Bước 3:** Go to /admin/audit-logs

**Bước 4:** Check top log
```
Should see:
✅ Recent LOGIN log
✅ User: admin@example.com
✅ Action: LOGIN (blue badge)
✅ Status: SUCCESS (green badge)
✅ Timestamp: just now
```

---

### Test Logout Log:

**Bước 1:** Click "Đăng xuất"

**Bước 2:** Login ADMIN again

**Bước 3:** Go to /admin/audit-logs

**Bước 4:** Check top logs
```
Should see:
✅ LOGIN log (most recent)
✅ LOGOUT log (second)
✅ Both with correct timestamps
```

---

### Test Access Denied Log:

**Bước 1:** Try to access /staff/dashboard (as ADMIN)

**Bước 2:** Go to /admin/audit-logs

**Bước 3:** Check logs
```
Should see:
✅ Access log for /staff/dashboard
✅ Status: SUCCESS (ADMIN can access)
```

**Bước 4:** Login CUSTOMER

**Bước 5:** Try to access /admin/dashboard

**Bước 6:** Login ADMIN again

**Bước 7:** Check audit logs
```
Should see:
✅ ACCESS_DENIED log
✅ User: an.customer@example.com
✅ Resource: /admin/dashboard
✅ Status: DENIED (red badge)
```

**✅ PASS nếu logs được tạo đúng**

---

## ✅ TEST CASE 7: EMPTY STATE

### Bước 1: Clear Database (Optional)
```sql
-- If you want to test empty state
DELETE FROM AuditLog;
```

### Bước 2: Refresh /admin/audit-logs

### Bước 3: Verify Empty State
```
Should see:
✅ Shield icon (large, gray)
✅ "Chưa có audit logs" message
✅ Helpful text
✅ No table
```

**✅ PASS nếu empty state đẹp**

---

## 📊 TEST RESULTS TABLE

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| No Hydration Error | Clean console | | ⬜ |
| Beautiful UI | All elements present | | ⬜ |
| Search Works | Filters correctly | | ⬜ |
| Status Filter | Shows correct logs | | ⬜ |
| Action Filter | Shows correct logs | | ⬜ |
| Combined Filters | Works together | | ⬜ |
| STAFF Denied | Redirect to /403 | | ⬜ |
| CUSTOMER Denied | Redirect to /403 | | ⬜ |
| Login Log Created | Appears in logs | | ⬜ |
| Logout Log Created | Appears in logs | | ⬜ |
| Empty State | Shows message | | ⬜ |

**Điền ✅ vào cột Status khi test pass**

---

## 🐛 DEBUGGING

### If Hydration Error:

**1. Check Console:**
```
Look for exact error message
Note which component/element
```

**2. Check formatDate:**
```
src/lib/utils.ts
Should have fixed timezone: 'Asia/Ho_Chi_Minh'
```

**3. Check Server Formatting:**
```
src/app/admin/audit/page.tsx
Should format dates before passing to client
```

**4. Clear Cache:**
```bash
rm -rf .next
npm run dev
```

---

### If UI Broken:

**1. Check Imports:**
```
LogoutButton imported?
Card components imported?
Icons imported?
```

**2. Check Tailwind:**
```
Classes applied correctly?
Dark theme working?
```

**3. Check Data:**
```
Logs array not empty?
Formatted correctly?
```

---

## 🎯 QUICK TEST SCRIPT

```bash
# 1. Start server
npm run dev

# 2. Login ADMIN
admin@example.com / Admin@123456

# 3. Go to audit logs
/admin/audit-logs

# 4. Check console
No hydration errors ✅

# 5. Check UI
Beautiful dark theme ✅
Stats cards ✅
Filters ✅
Table ✅

# 6. Test search
Type "admin" → filters ✅

# 7. Test filters
Status "SUCCESS" → filters ✅
Action "LOGIN" → filters ✅

# 8. Test RBAC
Login STAFF → /admin/audit-logs → /403 ✅

# 9. Test logs
Logout/Login → new logs appear ✅
```

---

## ✅ SUCCESS CRITERIA

All tests pass if:

1. ✅ No hydration errors in console
2. ✅ Beautiful UI with dark theme
3. ✅ All stats cards show correct numbers
4. ✅ Search works for email/action/resource
5. ✅ Status filter works
6. ✅ Action filter works
7. ✅ Combined filters work
8. ✅ STAFF/CUSTOMER denied access
9. ✅ Logs created on login/logout
10. ✅ Empty state shows when no logs

---

## 🎉 EXPECTED RESULT

After fix:

✅ No hydration errors  
✅ Beautiful dark theme UI  
✅ Full search/filter functionality  
✅ Stats cards with icons  
✅ Security explanation  
✅ RBAC protection  
✅ Smooth animations  

**Ready to demo! 🚀**
