import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Tag,
  ChevronRight 
} from 'lucide-react';
import { getProductById, getProducts } from '@/config/products';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TagBadge } from '@/components/ui/TagBadge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const product = useMemo(() => {
    if (!id) return undefined;
    return getProductById(id);
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getProducts()
      .filter(p => 
        p.id !== product.id && 
        p.tags.some(tag => product.tags.includes(tag))
      )
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="animate-fade-up">
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex-1">
                  {product.name}
                </h1>
                <StatusBadge status={product.status} size="lg" />
              </div>
              <p className="text-xl text-muted-foreground">
                {product.shortDescription}
              </p>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 md:p-8 animate-fade-up delay-100">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div className="animate-fade-up delay-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag size={18} className="text-primary" />
                Technologies & Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Actions card */}
            <div className="glass rounded-2xl p-6 animate-fade-up delay-300">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              
              {product.status === 'live' && (
                <Button asChild className="w-full mb-3 glow-sm">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Visit Live Site
                  </a>
                </Button>
              )}

              {product.status === 'planned' && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">This product is currently in planning.</p>
                </div>
              )}

              {product.status === 'archived' && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">This product has been archived.</p>
                </div>
              )}
            </div>

            {/* Metadata card */}
            <div className="glass rounded-2xl p-6 animate-fade-up delay-400">
              <h3 className="font-semibold mb-4">Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Created</div>
                    <div className="font-medium">{formattedDate}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">URL</div>
                  <code className="text-xs bg-muted/50 px-2 py-1 rounded block truncate">
                    {product.url}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((related, index) => (
                <div
                  key={related.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={related} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
