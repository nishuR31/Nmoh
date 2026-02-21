/**
 * Product Data Configuration
 * 
 * This config file serves as the data layer abstraction.
 * Architecture designed for seamless DB replacement later.
 */

export type ProductStatus = 'live' | 'planned' | 'archived';

export interface ProductMetadata {
  title?: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  domain?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  url: string;
  tags: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  metadata?: ProductMetadata;
  featured?: boolean;
  internalNotes?: string; // Admin only
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Sample product data - replace with DB fetch later
export const products: Product[] = [
  {
    id: 'product-hub',
    name: 'Product Hub',
    description: 'A centralized dashboard for managing and monitoring all personal products. Built with React, TypeScript, and Tailwind CSS with a focus on performance and beautiful UI.',
    shortDescription: 'Centralized product management dashboard',
    url: 'https://producthub.dev',
    tags: ['React', 'TypeScript', 'Tailwind', 'Dashboard'],
    status: 'live',
    createdAt: '2024-01-15',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    thumbnailAlt: 'Dashboard interface with analytics charts',
    metadata: {
      title: 'Product Hub - Manage Your Products',
      description: 'A centralized dashboard for managing all your personal products',
      domain: 'producthub.dev',
      favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32',
    },
  },
  {
    id: 'ai-writer',
    name: 'AI Writer Pro',
    description: 'An intelligent writing assistant powered by GPT-4 that helps create content, refine copy, and generate ideas. Features real-time suggestions and multiple writing modes.',
    shortDescription: 'AI-powered writing assistant',
    url: 'https://aiwriter.pro',
    tags: ['AI', 'GPT-4', 'SaaS', 'Writing'],
    status: 'live',
    createdAt: '2024-02-20',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    thumbnailAlt: 'AI writing interface with text generation',
    metadata: {
      title: 'AI Writer Pro - Intelligent Writing Assistant',
      description: 'Create content faster with AI-powered writing',
      domain: 'aiwriter.pro',
      favicon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=32',
    },
  },
  {
    id: 'devtools-kit',
    name: 'DevTools Kit',
    description: 'A comprehensive collection of developer utilities including JSON formatter, regex tester, code beautifier, and more. All tools work offline and respect your privacy.',
    shortDescription: 'Essential developer utilities',
    url: 'https://devtools.kit',
    tags: ['Tools', 'Developer', 'Utilities', 'Open Source'],
    status: 'live',
    createdAt: '2023-11-10',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    thumbnailAlt: 'Code editor with developer tools',
    metadata: {
      title: 'DevTools Kit - Developer Utilities',
      description: 'Essential tools for developers',
      domain: 'devtools.kit',
    },
  },
  {
    id: 'metrics-dashboard',
    name: 'Metrics Dashboard',
    description: 'Real-time analytics dashboard for tracking product metrics, user engagement, and business KPIs. Integrates with multiple data sources.',
    shortDescription: 'Real-time analytics platform',
    url: 'https://metrics.dashboard',
    tags: ['Analytics', 'Dashboard', 'Metrics', 'Data'],
    status: 'planned',
    createdAt: '2024-03-01',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    thumbnailAlt: 'Analytics dashboard with charts and graphs',
    metadata: {
      title: 'Metrics Dashboard - Analytics Platform',
      description: 'Track your product metrics in real-time',
      domain: 'metrics.dashboard',
    },
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'A unified API gateway service for managing, monitoring, and securing API endpoints across all products. Features rate limiting, authentication, and logging.',
    shortDescription: 'Unified API management',
    url: 'https://api.gateway',
    tags: ['API', 'Backend', 'Infrastructure', 'Security'],
    status: 'planned',
    createdAt: '2024-03-15',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    thumbnailAlt: 'Server infrastructure and API connections',
    metadata: {
      title: 'API Gateway - Unified API Management',
      description: 'Manage and secure your APIs',
      domain: 'api.gateway',
    },
  },
  {
    id: 'legacy-cms',
    name: 'Legacy CMS',
    description: 'Original content management system that served its purpose. Now deprecated in favor of more modern solutions.',
    shortDescription: 'Deprecated content management system',
    url: 'https://legacy.cms',
    tags: ['CMS', 'Legacy', 'Content'],
    status: 'archived',
    createdAt: '2022-05-20',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop',
    thumbnailAlt: 'Old content management interface',
  },
];

export const categories: ProductCategory[] = [
  {
    id: 'saas',
    name: 'SaaS Products',
    description: 'Software as a Service applications',
    icon: 'Cloud',
  },
  {
    id: 'tools',
    name: 'Developer Tools',
    description: 'Utilities and tools for developers',
    icon: 'Wrench',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Backend and infrastructure services',
    icon: 'Server',
  },
];

// Data access functions - abstraction layer for future DB integration
export const getProducts = (): Product[] => products;

export const getProductById = (id: string): Product | undefined => 
  products.find(p => p.id === id);

export const getProductsByStatus = (status: ProductStatus): Product[] => 
  products.filter(p => p.status === status);

export const getFeaturedProducts = (): Product[] => 
  products.filter(p => p.featured);

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getProductsByTag = (tag: string): Product[] => 
  products.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  products.forEach(p => p.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
};

export const getProductStats = () => ({
  total: products.length,
  live: products.filter(p => p.status === 'live').length,
  planned: products.filter(p => p.status === 'planned').length,
  archived: products.filter(p => p.status === 'archived').length,
});
