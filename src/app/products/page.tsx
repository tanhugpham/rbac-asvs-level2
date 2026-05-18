import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      {user && (
        <div style={{ marginBottom: '24px' }}>
          <Link href="/account" style={{ color: '#0070f3' }}>
            ← Back to Account
          </Link>
        </div>
      )}

      <div className="card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Products</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #eee',
              }}
            >
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#0070f3' }}>
                  ${product.price.toFixed(2)}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No products available
          </p>
        )}
      </div>
    </div>
  );
}
