// role_permission_matrix.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function generateMatrix() {
    // Lấy tất cả roles và permissions
    const roles = await prisma.role.findMany()
    const permissions = await prisma.permission.findMany()
    
    // Lấy mapping role-permission
    const mappings = await prisma.rolePermission.findMany({
        include: { role: true, permission: true }
    })
    
    // Tạo ma trận
    const matrix = {}
    roles.forEach(role => {
        matrix[role.name] = {}
        permissions.forEach(perm => {
            matrix[role.name][perm.name] = '❌'
        })
    })
    
    // Đánh dấu các quyền có
    mappings.forEach(m => {
        matrix[m.role.name][m.permission.name] = '✅'
    })
    
    // In ma trận dạng bảng
    console.log('\n========== ROLE-PERMISSION MATRIX ==========\n')
    
    // Header
    let header = 'Role'.padEnd(15)
    permissions.forEach(p => { header += `| ${p.name.padEnd(15)}` })
    console.log(header)
    console.log('-'.repeat(header.length))
    
    // Rows
    roles.forEach(role => {
        let row = role.name.padEnd(15)
        permissions.forEach(perm => {
            row += `| ${matrix[role.name][perm.name].padEnd(15)}`
        })
        console.log(row)
    })
    
    return matrix
}

generateMatrix()