import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Lấy tất cả Roles kèm theo các Permissions của từng Role
  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // 2. Lấy danh sách tất cả Permissions duy nhất trong hệ thống
  const permissions = await prisma.permission.findMany({
    orderBy: { name: 'asc' },
  });

  // 3. Xây dựng cấu trúc dữ liệu cho bảng hiển thị
  const matrixData = permissions.map((perm) => {
    const row: any = {
      'Resource : Action (Permission)': perm.name,
    };

    // Kiểm tra xem từng Role có sở hữu Permission này không
    roles.forEach((role) => {
      const hasPermission = role.rolePermissions.some(
        (rp) => rp.permissionId === perm.id
      );
      // Sử dụng ký tự trực quan để hiển thị trong Terminal
      row[role.name] = hasPermission ? '   ✅   ' : '   ❌   ';
    });

    return row;
  });

  console.log('\n=============================================================');
  console.log('📊 MA TRẬN PHÂN QUYỀN HỆ THỐNG (RBAC MATRIX FROM DATABASE)');
  console.log('=============================================================\n');
  
  // In ra dạng bảng đẹp mắt trên Terminal
  console.table(matrixData);
  
  console.log('\n=============================================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });