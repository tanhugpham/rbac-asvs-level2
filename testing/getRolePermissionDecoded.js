// getRolePermissionDecoded.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getRolePermissionDecoded() {
    try {
        // Lấy tất cả role_permission kèm thông tin role và permission
        const data = await prisma.rolePermission.findMany({
            include: {
                role: true,        // Lấy thông tin role (có name)
                permission: true   // Lấy thông tin permission (có name)
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Chuyển đổi dữ liệu sang dạng readable
        const decodedData = data.map(item => ({
            id: item.roleId,
            roleName: item.role?.name || 'Unknown',
            permissionName: item.permission?.name || 'Unknown',
            createdAt: item.createdAt
        }))

        return decodedData
    } catch (error) {
        console.error('Lỗi truy vấn:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

async function main() {
    console.log('🔄 Đang kết nối database qua Prisma...')
    
    const data = await getRolePermissionDecoded()
    
    console.log('\n========== ROLE-PERMISSION (DECODED) ==========\n')
    console.table(data.map(item => ({
        'Role': item.roleName,
        'Permission': item.permissionName,
        'Created At': item.createdAt?.toISOString() || item.createdAt
    })))
    
    console.log(`\n✅ Tổng cộng: ${data.length} bản ghi`)
    
    // Lưu ra file JSON để dùng trong Canvas
    const fs = require('fs')
    fs.writeFileSync('role_permission_decoded.json', JSON.stringify(data, null, 2))
    console.log('📁 Đã lưu file role_permission_decoded.json')
    
    // Hiển thị 3 dòng đầu tiên dạng text cho Canvas
    console.log('\n📊 Dữ liệu mẫu cho Canvas:')
    data.slice(0, 5).forEach(item => {
        console.log(`  → ${item.roleName}  ->  ${item.permissionName}`)
    })
}

// Chạy chương trình
main().catch(e => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
})