/**
 * Seed Script - Khởi tạo dữ liệu RBAC với Fake Users Tiếng Việt
 * Tạo permissions, roles và fake users cho demo
 */

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../src/types/auth';

const prisma = new PrismaClient();

// Danh sách fake users tiếng Việt
interface FakeUser {
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  password: string;
}

const FAKE_USERS: FakeUser[] = [
  // ADMIN
  {
    name: 'Nguyễn Minh Quân',
    email: 'admin@example.com',
    role: 'ADMIN',
    password: 'Admin@123456',
  },
  
  // STAFF
  {
    name: 'Trần Quốc Bảo',
    email: 'staff@example.com',
    role: 'STAFF',
    password: 'Staff@123456',
  },
  {
    name: 'Lê Thị Mai Anh',
    email: 'maianh.staff@example.com',
    role: 'STAFF',
    password: 'Staff@123456',
  },
  {
    name: 'Phạm Hoàng Nam',
    email: 'hoangnam.staff@example.com',
    role: 'STAFF',
    password: 'Staff@123456',
  },
  
  // CUSTOMER
  {
    name: 'Nguyễn Văn An',
    email: 'an.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Trần Thị Bích Ngọc',
    email: 'bichngoc.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Lê Minh Khang',
    email: 'khang.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Phạm Gia Huy',
    email: 'giahuy.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Hoàng Thanh Tâm',
    email: 'thanhtam.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Đỗ Hải Đăng',
    email: 'haidang.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Vũ Phương Linh',
    email: 'phuonglinh.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Bùi Nhật Minh',
    email: 'nhatminh.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Đặng Khánh Vy',
    email: 'khanhvy.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
  {
    name: 'Nguyễn Tuấn Kiệt',
    email: 'tuankiet.customer@example.com',
    role: 'CUSTOMER',
    password: 'Customer@123456',
  },
];

async function main() {
  console.log('🌱 Starting seed with Vietnamese fake users...');

  // 1. Tạo tất cả permissions
  console.log('📝 Creating permissions...');
  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((permissionName) =>
      prisma.permission.upsert({
        where: { name: permissionName },
        update: {},
        create: {
          name: permissionName,
          description: getPermissionDescription(permissionName),
        },
      })
    )
  );
  console.log(`✅ Created ${permissionRecords.length} permissions`);

  // 2. Tạo roles
  console.log('👥 Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: ROLES.ADMIN },
    update: {},
    create: {
      name: ROLES.ADMIN,
      description: 'Quản trị viên có toàn quyền',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: ROLES.STAFF },
    update: {},
    create: {
      name: ROLES.STAFF,
      description: 'Nhân viên quản lý sản phẩm và đơn hàng',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: ROLES.CUSTOMER },
    update: {},
    create: {
      name: ROLES.CUSTOMER,
      description: 'Khách hàng với quyền truy cập cơ bản',
    },
  });
  console.log('✅ Created 3 roles');

  // 3. Gán permissions cho roles
  console.log('🔗 Assigning permissions to roles...');

  // Xóa permissions cũ trước khi gán mới
  await prisma.rolePermission.deleteMany({});

  // Gán permissions cho ADMIN
  for (const permissionName of ROLE_PERMISSIONS.ADMIN) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName },
    });
    if (permission) {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Gán permissions cho STAFF
  for (const permissionName of ROLE_PERMISSIONS.STAFF) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName },
    });
    if (permission) {
      await prisma.rolePermission.create({
        data: {
          roleId: staffRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Gán permissions cho CUSTOMER
  for (const permissionName of ROLE_PERMISSIONS.CUSTOMER) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName },
    });
    if (permission) {
      await prisma.rolePermission.create({
        data: {
          roleId: customerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log('✅ Assigned permissions to roles');

  // 4. Tạo fake users tiếng Việt
  console.log('👥 Creating Vietnamese fake users...');
  
  const roleMap = {
    ADMIN: adminRole,
    STAFF: staffRole,
    CUSTOMER: customerRole,
  };

  const createdUsers: Array<{ name: string; email: string; role: string; password: string }> = [];

  for (const fakeUser of FAKE_USERS) {
    // Hash password
    const hashedPassword = await hashPassword(fakeUser.password);

    // Tạo user (upsert để tránh trùng)
    const user = await prisma.user.upsert({
      where: { email: fakeUser.email },
      update: {},
      create: {
        email: fakeUser.email,
        name: fakeUser.name,
        password: hashedPassword,
        isActive: true,
      },
    });

    // Gán role cho user
    const role = roleMap[fakeUser.role];
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });

    createdUsers.push({
      name: fakeUser.name,
      email: fakeUser.email,
      role: fakeUser.role,
      password: fakeUser.password,
    });
  }

  console.log(`✅ Created ${createdUsers.length} Vietnamese fake users`);

  // 5. Tạo sản phẩm mẫu tiếng Việt
  console.log('📦 Creating Vietnamese sample products...');
  await prisma.product.createMany({
    data: [
      {
        name: 'Tài khoản Netflix Premium',
        description: 'Gói 1 tháng, xem không giới hạn, chất lượng 4K',
        price: 180000,
        stock: 25,
        isActive: true,
      },
      {
        name: 'Tài khoản Spotify Premium',
        description: 'Gói 1 tháng, nghe nhạc không quảng cáo',
        price: 59000,
        stock: 30,
        isActive: true,
      },
      {
        name: 'Tài khoản Disney+ Premium',
        description: 'Gói 1 tháng, xem phim Disney, Marvel, Star Wars',
        price: 150000,
        stock: 20,
        isActive: true,
      },
      {
        name: 'Tài khoản YouTube Premium',
        description: 'Gói 1 tháng, xem video không quảng cáo',
        price: 79000,
        stock: 35,
        isActive: true,
      },
      {
        name: 'Tài khoản Canva Pro',
        description: 'Gói 1 tháng, thiết kế đồ họa chuyên nghiệp',
        price: 120000,
        stock: 15,
        isActive: true,
      },
      {
        name: 'Tài khoản ChatGPT Plus',
        description: 'Gói 1 tháng, truy cập GPT-4 không giới hạn',
        price: 450000,
        stock: 10,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created Vietnamese sample products');

  // 6. In ra danh sách tài khoản demo
  console.log('\n🎉 Seed completed successfully!');
  console.log('\n' + '='.repeat(80));
  console.log('📋 DANH SÁCH TÀI KHOẢN DEMO (VIETNAMESE FAKE USERS)');
  console.log('='.repeat(80));
  
  console.log('\n👑 ADMIN (Quản trị viên):');
  createdUsers
    .filter(u => u.role === 'ADMIN')
    .forEach(u => {
      console.log(`   • ${u.name.padEnd(25)} | ${u.email.padEnd(35)} | ${u.password}`);
    });

  console.log('\n👔 STAFF (Nhân viên):');
  createdUsers
    .filter(u => u.role === 'STAFF')
    .forEach(u => {
      console.log(`   • ${u.name.padEnd(25)} | ${u.email.padEnd(35)} | ${u.password}`);
    });

  console.log('\n👤 CUSTOMER (Khách hàng):');
  createdUsers
    .filter(u => u.role === 'CUSTOMER')
    .forEach(u => {
      console.log(`   • ${u.name.padEnd(25)} | ${u.email.padEnd(35)} | ${u.password}`);
    });

  console.log('\n' + '='.repeat(80));
  console.log('💡 LƯU Ý:');
  console.log('   - Tất cả mật khẩu đã được hash bằng bcryptjs');
  console.log('   - Dữ liệu này chỉ dùng cho demo, không dùng trong production');
  console.log('   - Email sử dụng domain giả @example.com');
  console.log('='.repeat(80));
  console.log('\n✅ Bạn có thể đăng nhập với bất kỳ tài khoản nào ở trên!');
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'user:read': 'View user information',
    'user:create': 'Create new users',
    'user:update': 'Update user information',
    'user:delete': 'Delete users',
    'role:read': 'View roles and permissions',
    'role:create': 'Create new roles',
    'role:update': 'Update roles and assign permissions',
    'role:delete': 'Delete roles',
    'product:read': 'View products',
    'product:create': 'Create new products',
    'product:update': 'Update product information',
    'product:delete': 'Delete products',
    'order:read': 'View all orders',
    'order:manage': 'Manage orders (update status, etc.)',
    'order:read_own': 'View own orders only',
    'account:read_secret': 'View account credentials after purchase',
    'audit:read': 'View audit logs',
  };
  return descriptions[permission] || permission;
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
