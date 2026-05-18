'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { LogoutButton } from '@/components/LogoutButton';
import { getDashboardPath } from '@/lib/dashboard-routes';
import type { SessionUser } from '@/types/auth';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

interface ProductsClientProps {
  products: Product[];
  user: SessionUser;
  canManageProducts: boolean;
}

// Product type badges
const PRODUCT_TYPES: Record<string, { color: string; icon: string }> = {
  Netflix: { color: 'bg-red-500/10 text-red-500 border-red-500/30', icon: '🎬' },
  Spotify: { color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: '🎵' },
  'Disney+': { color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: '🏰' },
  YouTube: { color: 'bg-red-600/10 text-red-600 border-red-600/30', icon: '📺' },
  Canva: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/30', icon: '🎨' },
  ChatGPT: { color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30', icon: '🤖' },
  Steam: { color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30', icon: '🎮' },
};

function getProductType(name: string): string {
  for (const type of Object.keys(PRODUCT_TYPES)) {
    if (name.includes(type)) {
      return type;
    }
  }
  return 'Other';
}

export function ProductsClient({ products, user, canManageProducts }: ProductsClientProps) {
  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={getDashboardPath(user.roles[0] as any)}
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Products</h1>
                  <p className="text-gray-400">
                    {canManageProducts
                      ? 'Manage products and inventory'
                      : 'Browse available products'}
                  </p>
                </div>
              </div>
            </div>
            <LogoutButton variant="default" />
          </div>
        </motion.div>

        {/* Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex gap-4">
            <Card className="border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-white">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-400">In Stock</p>
                    <p className="text-2xl font-bold text-white">
                      {products.filter((p) => p.stock > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {canManageProducts && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </motion.button>
          )}
        </motion.div>

        {/* RBAC Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-blue-400">Access Level: {user.roles[0]}</p>
                  <p className="mt-1">
                    {canManageProducts
                      ? 'You have permission to create, update, and delete products.'
                      : 'You can view products and make purchases. Product management requires ADMIN or STAFF role.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-16 w-16 text-gray-600" />
                <h3 className="mt-4 text-lg font-semibold text-white">No Products Available</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {canManageProducts
                    ? 'Get started by adding your first product'
                    : 'Check back later for new products'}
                </p>
                {canManageProducts && (
                  <button className="mt-6 flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-700">
                    <Plus className="h-5 w-5" />
                    Add First Product
                  </button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const productType = getProductType(product.name);
              const typeConfig = PRODUCT_TYPES[productType] || {
                color: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
                icon: '📦',
              };

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="group h-full transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
                    <CardContent className="flex h-full flex-col p-6">
                      {/* Product Image Placeholder */}
                      <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <span className="text-6xl">{typeConfig.icon}</span>
                      </div>

                      {/* Product Type Badge */}
                      <div className="mb-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${typeConfig.color}`}
                        >
                          {productType}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="mb-2 text-xl font-bold text-white">{product.name}</h3>

                      {/* Product Description */}
                      <p className="mb-4 flex-1 text-sm text-gray-400">
                        {product.description || 'No description available'}
                      </p>

                      {/* Price & Stock */}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-purple-400">
                            {product.price.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                        <div className="text-right">
                          {product.stock > 0 ? (
                            <div className="flex items-center gap-1 text-green-500">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-semibold">In Stock</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-500">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-semibold">Out of Stock</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-400">{product.stock} available</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {canManageProducts ? (
                          <>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400 transition-all hover:bg-yellow-500/20">
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20">
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button
                              disabled={product.stock === 0}
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Buy Now
                            </button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
