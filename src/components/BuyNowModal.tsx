'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export function BuyNowModal({ isOpen, onClose, product, onSuccess }: BuyNowModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBuy = async () => {
    if (!product) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create order');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setQuantity(1);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Order Placed Successfully!</h3>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Your order has been created. You can view it in your orders.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                    <ShoppingCart className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Buy Now</h3>
                  <p className="mt-1 text-sm text-gray-400">{product.name}</p>
                </div>

                {/* Product Info */}
                <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {product.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Available</p>
                      <p className="text-lg font-semibold text-white">{product.stock}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, val), product.stock));
                      }}
                      min={1}
                      max={product.stock}
                      className="h-10 w-20 rounded-lg border border-white/10 bg-white/5 text-center text-lg font-semibold text-white focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 flex items-center justify-between rounded-xl bg-purple-500/10 p-4">
                  <span className="text-sm text-gray-300">Total</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {(product.price * quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Buy Button */}
                <button
                  onClick={handleBuy}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now - {product.name}
                    </>
                  )}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}