# 🚀 DASHBOARD ROUTES - QUICK REFERENCE

## ⚡ IMPORT

```typescript
import { getDashboardPath, getDashboardPathFromRoles, DASHBOARD_ROUTES } from '@/lib/dashboard-routes';
import { ROLES } from '@/types/auth';
```

---

## 📍 CORRECT ROUTES

```
ADMIN    → /admin/dashboard
STAFF    → /staff/dashboard
CUSTOMER → /account
```

---

## 🔧 USAGE

### Get Path by Role:
```typescript
const path = getDashboardPath(ROLES.ADMIN);
// '/admin/dashboard'
```

### Get Path from User Roles:
```typescript
const user = { roles: ['ADMIN', 'STAFF'] };
const path = getDashboardPathFromRoles(user.roles);
// '/admin/dashboard' (uses first role)
```

### Use in Link:
```tsx
<Link href={getDashboardPath(ROLES.ADMIN)}>
  Dashboard
</Link>
```

### Use in Redirect:
```typescript
const path = getDashboardPath(role);
redirect(path);
```

### Use Constants:
```tsx
<Link href={DASHBOARD_ROUTES.ADMIN}>
  Admin Dashboard
</Link>
```

---

## ✅ QUICK TEST

```bash
# 1. Start server
npm run dev

# 2. Test ADMIN
Login ADMIN → Check URL: /admin/dashboard ✅

# 3. Test STAFF
Login STAFF → Check URL: /staff/dashboard ✅

# 4. Test CUSTOMER
Login CUSTOMER → Check URL: /account ✅

# 5. Test Back Button
Go to /security/attack-simulation
Click "Back to Dashboard"
Check URL: /admin/dashboard ✅
```

---

## 🐛 WRONG ROUTES (DON'T USE)

```
❌ /dashboard/admin
❌ /dashboard/staff
❌ /dashboard/customer
```

---

## 📚 DOCS

```
DASHBOARD_ROUTES_FIX.md     - Full documentation
TEST_DASHBOARD_ROUTES.md    - Test guide
FIX_404_SUMMARY.md          - Summary
```

---

## ✅ STATUS

**COMPLETE** - No more 404 errors! 🎉
