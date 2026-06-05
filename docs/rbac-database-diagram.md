# RBAC Database Diagram

```mermaid
erDiagram
    User ||--o{ UserRole : has
    Role ||--o{ UserRole : assigned

    Role ||--o{ RolePermission : has
    Permission ||--o{ RolePermission : includes

    User {
        string id PK
        string name
        string email
        string password
        decimal balance
        datetime createdAt
    }

    Role {
        string id PK
        string name
        string description
    }

    Permission {
        string id PK
        string name
        string description
    }

    UserRole {
        string userId FK
        string roleId FK
    }

    RolePermission {
        string roleId FK
        string permissionId FK
    }