/**
 * CategoryForm Component
 * Form for creating and editing categories
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Category } from '../../lib/types';

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
  onSubmit: (formData: FormData) => Promise<{ success: boolean; message: string; errors?: Record<string, string> }>;
}

export default function CategoryForm({ category, mode, onSubmit }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [order, setOrder] = useState(category?.order?.toString() || '0');
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  
  // Auto-generate slug from name
  useEffect(() => {
    if (mode === 'create' && name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, mode, slug]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('icon', icon);
    formData.append('order', order);
    formData.append('isActive', isActive.toString());
    
    const result = await onSubmit(formData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        router.push('/categories');
      }, 1500);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors({ general: result.message });
      }
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errors.general && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Information</h3>
        
        <div className="space-y-4">
          <Input
            id="name"
            label="Category Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
            maxLength={100}
          />
          
          <Input
            id="slug"
            label="URL Slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            error={errors.slug}
            helperText="URL-friendly identifier (lowercase, numbers, hyphens only)"
            required
          />
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              rows={3}
              maxLength={500}
              required
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1.5 text-sm text-gray-500">{description.length}/500 characters</p>
          </div>
          
          <Input
            id="icon"
            label="Icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            error={errors.icon}
            helperText="Emoji or icon identifier"
            required
          />
          
          <Input
            id="order"
            label="Display Order"
            type="number"
            min="0"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            error={errors.order}
            helperText="Lower numbers appear first"
            required
          />
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-700">Active</span>
          </label>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Update Category'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/categories')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
