import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../lib/format';
import type { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
      <div className="relative h-48 bg-zinc-200 dark:bg-zinc-800">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">{product.name}</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 flex-1">{product.description}</p>
        <span className="text-2xl font-bold text-black dark:text-zinc-50 mb-4">
          {formatPrice(product.price)}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition text-center"
          >
            View Details
          </Link>
          <AddToCartButton productId={product.id} variant="compact" />
        </div>
      </div>
    </div>
  );
}
