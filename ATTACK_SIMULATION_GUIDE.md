# 🎯 Live Attack Simulation - Demo Guide

## 🚀 FEATURE OVERVIEW

**Live Attack Simulation** là tính năng demo cực kỳ ấn tượng, cho phép giảng viên xem real-time cách hệ thống RBAC chặn các cuộc tấn công trái phép.

### Key Features
- ✅ **6 Attack Scenarios** - Các kịch bản tấn công thực tế
- ✅ **Terminal-Style Display** - Giao diện terminal chuyên nghiệp
- ✅ **Real-time Animation** - Hiển thị từng bước với animation
- ✅ **OWASP ASVS Mapping** - Giải thích compliance cho từng bước
- ✅ **Audit Logging** - Tự động tạo audit log
- ✅ **Color-Coded Status** - Green (success), Red (blocked), Yellow (warning)

---

## 🎬 DEMO SCENARIOS

### 1. Customer → Admin Dashboard
**Severity**: HIGH 🔴

**Description**: CUSTOMER role cố truy cập admin dashboard

**Attack Flow**:
1. User clicks admin dashboard link
2. Middleware checks authentication ✅
3. Middleware checks route protection ✅
4. Server loads user session ✅
5. **Authorization checks permission: audit:read** ❌ BLOCKED
6. Audit log created ✅
7. Redirect to /403 ✅

**Blocked At**: Authorization Layer (Step 5)

**OWASP ASVS**:
- V4.1.1: Server-side access control
- V4.1.3: Least privilege
- V4.1.5: Fail securely
- V7.1.1: Security event logged

---

### 2. Staff → Modify Admin Role
**Severity**: CRITICAL 🔴🔴

**Description**: STAFF role cố sửa permissions của ADMIN role

**Attack Flow**:
1. STAFF submits role modification request
2. JWT token verified ✅
3. Request body parsed ✅
4. **Authorization checks permission: role:update** ❌ BLOCKED
5. CRITICAL audit log created ✅
6. Return 403 Forbidden ✅

**Blocked At**: API Authorization Layer (Step 4)

**OWASP ASVS**:
- V4.1.1: Server-side authorization in API
- V4.1.3: STAFF cannot modify roles
- V4.1.5: Fail securely
- V7.1.1: Critical event logged

---

### 3. Customer → Other User Order
**Severity**: HIGH 🔴

**Description**: CUSTOMER cố xem order của user khác

**Attack Flow**:
1. Request order details
2. User authenticated ✅
3. Order fetched from database ✅
4. **Ownership validation fails** ❌ BLOCKED
5. Audit log created ✅
6. Return 404 (not 403 to hide existence) ✅

**Blocked At**: Ownership Validation Layer (Step 4)

**OWASP ASVS**:
- V4.1.1: Server-side ownership validation
- V4.2.1: Resource-level access control
- V4.1.5: Hide resource existence
- V7.1.1: Unauthorized access logged

---

### 4. Fake JWT Token
**Severity**: CRITICAL 🔴🔴

**Description**: Attacker gửi JWT token giả mạo

**Attack Flow**:
1. Request with forged token
2. Token extracted from cookie ✅
3. **JWT signature verification fails** ❌ BLOCKED
4. CRITICAL audit log created ✅
5. Redirect to /login ✅

**Blocked At**: JWT Verification Layer (Step 3)

**OWASP ASVS**:
- V3.5.2: Cryptographic JWT verification
- V8.3.1: Session tokens verified
- V4.1.5: Reject invalid tokens
- V7.1.1: Suspicious activity logged

---

### 5. Missing Permission
**Severity**: MEDIUM 🟡

**Description**: User hợp lệ nhưng thiếu permission

**Attack Flow**:
1. Request security dashboard
2. Valid JWT token ✅
3. User permissions loaded ✅
4. **Required permission not found** ❌ BLOCKED
5. Audit log created ✅
6. Redirect to /403 ✅

**Blocked At**: Permission Check Layer (Step 4)

**OWASP ASVS**:
- V4.1.1: Granular permission checks
- V4.1.3: Least privilege enforced
- V4.1.5: Fail on missing permission

---

### 6. Expired Token
**Severity**: LOW 🟢

**Description**: User dùng JWT token đã hết hạn

**Attack Flow**:
1. Request with old token
2. Token extracted ✅
3. **Token expiration check fails** ❌ BLOCKED
4. Audit log created ✅
5. Redirect to /login ✅

**Blocked At**: JWT Verification Layer (Step 3)

**OWASP ASVS**:
- V3.5.3: Token expiration enforced
- V8.3.2: Session timeout implemented
- V4.1.5: Reject expired tokens

---

## 🎯 HOW TO DEMO

### Step 1: Access Page
```
Login as ADMIN: admin@example.com / Admin@123456
Navigate to: /security/attack-simulation
```

### Step 2: Select Scenario
Click on any attack scenario card:
- Customer → Admin Dashboard
- Staff → Modify Admin Role
- Customer → Other User Order
- Fake JWT Token
- Missing Permission
- Expired Token

### Step 3: Watch Real-time Simulation
Terminal will show:
- ⏱️ Timestamp for each step
- 🏷️ Layer name (Middleware, Authorization, etc.)
- 📝 Action description
- ✅ Success steps (green)
- ❌ Blocked step (red)
- 🛡️ OWASP ASVS references
- 📊 Final summary

### Step 4: Explain to Audience
Point out:
1. **Multi-layer security** - Multiple checks before blocking
2. **Server-side enforcement** - Cannot bypass client-side
3. **Fail securely** - Default deny
4. **Audit logging** - All attempts logged
5. **OWASP ASVS compliance** - Industry standard

### Step 5: Reset and Try Another
Click "Reset" button to try another scenario

---

## 🎨 UI FEATURES

### Terminal Style
- ✅ Black background with cyan accents
- ✅ Monospace font (font-mono)
- ✅ Terminal icon in header
- ✅ Scrollable output area
- ✅ Status footer

### Color Coding
- 🟢 **Green** - Success steps
- 🔴 **Red** - Blocked/Error steps
- 🟡 **Yellow** - Warning/Info
- 🔵 **Blue** - OWASP ASVS references
- 🟣 **Purple** - Audit log confirmation

### Animations
- ✅ Fade in/out
- ✅ Slide from left
- ✅ Typewriter effect (step-by-step)
- ✅ Pulse on blocked step
- ✅ Smooth transitions

### Icons
- ✅ CheckCircle - Success
- ✅ ShieldX - Blocked
- ✅ XCircle - Error
- ✅ Clock - Processing
- ✅ Shield - OWASP ASVS
- ✅ AlertTriangle - Warning

---

## 💡 DEMO TIPS

### Opening Statement
"Bây giờ tôi sẽ demo tính năng Live Attack Simulation. Đây là công cụ để visualize cách hệ thống RBAC chặn các cuộc tấn công trái phép real-time."

### During Simulation
1. **Point to each step** as it appears
2. **Explain the layer** (Middleware, Authorization, etc.)
3. **Highlight the blocked step** - "Đây là nơi attack bị chặn"
4. **Show OWASP ASVS reference** - "Tuân thủ ASVS V4.1.1"
5. **Show audit log** - "Hành động này được ghi log"

### Key Talking Points
- "Mọi request đều qua nhiều lớp security"
- "Server-side authorization - không thể bypass"
- "Fail securely - mặc định từ chối"
- "Audit logging đầy đủ"
- "OWASP ASVS Level 2 compliant"

### Impressive Moments
1. **Terminal animation** - "Real-time visualization"
2. **Blocked highlight** - "🛡️ ATTACK BLOCKED"
3. **OWASP ASVS mapping** - "Industry standard compliance"
4. **Audit log confirmation** - "Security event logged"

---

## 🔧 TECHNICAL DETAILS

### API Endpoint
```
POST /api/security/simulate-attack
Body: { scenario: "customer_access_admin" }
Response: { success: true, simulation: {...} }
```

### Permission Required
- **audit:read** (ADMIN only)

### Components
- `AttackSimulationTerminal.tsx` - Terminal display
- `attack-simulation.ts` - Simulation logic
- `/api/security/simulate-attack/route.ts` - API endpoint

### Data Flow
1. User clicks scenario
2. Frontend calls API
3. API checks permission (ADMIN only)
4. API calls `simulateAttack()`
5. Simulation generates steps
6. Audit log created
7. Response sent to frontend
8. Terminal animates steps

---

## 🎯 DEMO SCRIPT (5 minutes)

### Minute 1: Introduction
"Tính năng Live Attack Simulation cho phép visualize cách RBAC chặn attacks."

### Minute 2: Run First Scenario
"Chọn scenario: Customer → Admin Dashboard"
- Watch animation
- Point to blocked step
- Show OWASP ASVS

### Minute 3: Run Critical Scenario
"Scenario nghiêm trọng hơn: Staff → Modify Admin Role"
- Watch animation
- Highlight CRITICAL severity
- Show audit log

### Minute 4: Run Ownership Scenario
"Scenario ownership validation: Customer → Other User Order"
- Watch animation
- Explain 404 vs 403
- Show resource hiding

### Minute 5: Summary
"Tất cả attacks đều bị chặn bởi server-side authorization. Tuân thủ OWASP ASVS Level 2."

---

## 📊 EXPECTED QUESTIONS & ANSWERS

### Q: "Có thể bypass được không?"
**A**: "Không. Tất cả checks đều server-side. Ngay cả khi modify client code, server vẫn deny."

### Q: "Tại sao có nhiều layers?"
**A**: "Defense in depth. Nếu một layer fail, layers khác vẫn bảo vệ."

### Q: "Audit log lưu gì?"
**A**: "Timestamp, user, action, resource, permission, status, severity. Không lưu sensitive data."

### Q: "OWASP ASVS là gì?"
**A**: "Application Security Verification Standard của OWASP. Level 2 là standard cho production apps."

### Q: "Có thể thêm scenarios khác không?"
**A**: "Có. Chỉ cần thêm vào `attack-simulation.ts` với steps và ASVS mapping."

---

## 🚀 NEXT ENHANCEMENTS (Optional)

### Phase 2
- [ ] Add more scenarios (SQL injection, XSS, etc.)
- [ ] Real-time log streaming
- [ ] Export simulation report
- [ ] Compare multiple scenarios

### Phase 3
- [ ] Custom scenario builder
- [ ] Attack pattern detection
- [ ] Security score calculation
- [ ] Threat intelligence integration

---

## ✅ CHECKLIST

Before demo:
- [ ] Server running: `npm run dev`
- [ ] Login as ADMIN
- [ ] Navigate to `/security/attack-simulation`
- [ ] Test one scenario
- [ ] Prepare talking points

During demo:
- [ ] Explain feature purpose
- [ ] Run 2-3 scenarios
- [ ] Point to blocked steps
- [ ] Show OWASP ASVS compliance
- [ ] Show audit logging
- [ ] Answer questions

---

## 🎉 CONCLUSION

**Live Attack Simulation** là feature highlight của demo!

**Why It's Impressive**:
- ✅ Real-time visualization
- ✅ Terminal-style professional UI
- ✅ Multiple attack scenarios
- ✅ OWASP ASVS compliance mapping
- ✅ Audit logging demonstration
- ✅ Beautiful animations
- ✅ Easy to understand

**Demo Impact**: 10/10 🌟

**Estimated Demo Time**: 5 minutes
**Wow Factor**: Very High 🚀

---

**Status**: Ready to Demo ✅
**URL**: `/security/attack-simulation`
**Access**: ADMIN only
