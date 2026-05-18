import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { ProductsClient } from './ProductsClient';

export default async function ProductsPage() {
  try {
    console.log('[PRODUCTS] Loading products page...');
    
    const user = await getCurrentUser();

    if (!user) {
      redirect('/login');
    }

    console.log('[PRODUCTS] User:', user.email, 'Permissions:', user.permissions);

    // Check if user can manage products (ADMIN/STAFF)
    const canManageProducts = 
      user.permissions.includes(PERMISSIONS.PRODUCT_CREATE) ||
      user.permissions.includes(PERMISSIONS.PRODUCT_UPDATE) ||
      user.permissions.includes(PERMISSIONS.PRODUCT_DELETE);

    // Fetch products with error handling
    let products: any[] = [];

    try {
      products = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      }).catch(() => []);
    } catch (error) {
      console.error('[PRODUCTS] Error fetching products:', error);
      products = [];
    }

    console.log('[PRODUCTS] Loaded', products.length, 'products');

    return (
      <ProductsClient 
        products={products} 
        user={user}
        canManageProducts={canManageProducts}
      />
    );
  } catch (error: any) {
    console.error('[PRODUCTS] Error:', error);

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
