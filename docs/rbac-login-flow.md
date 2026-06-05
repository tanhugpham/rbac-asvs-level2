# RBAC Login Flow

```mermaid
flowchart TD
    A[User nhập email/password] --> B[Server kiểm tra tài khoản]
    B --> C{Thông tin đúng?}
    C -- Không --> D[Trả lỗi đăng nhập]
    C -- Có --> E[Lấy Role của User]
    E --> F[Lấy Permission từ Role]
    F --> G[Tạo JWT Token]
    G --> H[Lưu token vào Cookie]
    H --> I[User truy cập trang Admin]
    I --> J[Middleware kiểm tra permission]
    J --> K{Có quyền không?}
    K -- Có --> L[Cho phép truy cập]
    K -- Không --> M[Trả về 403 Forbidden]