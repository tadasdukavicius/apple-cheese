import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../lib/format';
import { startingPrice, type Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  /** Heading level, so the page outline stays correct on each page. */
  headingAs?: 'h2' | 'h3';
  priority?: boolean;
}

export default function ProductCard({ product, headingAs: Heading = 'h2', priority = false }: ProductCardProps) {
  const sizes = product.variants.map((v) => v.label).join(' · ');

  return (
    <article>
      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-line">
          <Image
            src={product.image_url}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
        <Heading className="mt-4 text-xl leading-snug text-ink group-hover:underline group-hover:underline-offset-4 md:text-2xl">
          {product.name}
        </Heading>
        {sizes && <p className="mt-1 text-sm text-muted">{sizes}</p>}
        <p className="mt-2 text-ink">
          <span className="text-sm text-muted">nuo </span>
          <span className="text-lg font-medium">{formatPrice(startingPrice(product))}</span>
        </p>
      </Link>
    </article>
  );
}
