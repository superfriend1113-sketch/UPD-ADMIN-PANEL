/**
 * DealForm Component
 * Form for creating and editing deals
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { calculateSavingsPercentage } from '../../lib/utils';
import type { Deal, Category, Retailer } from '../../lib/types';

// Client-side Deal type with Date objects instead of Timestamps
type ClientDeal = Omit<Deal, 'expirationDate' | 'createdAt' | 'updatedAt'> & {
  expirationDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

interface DealFormProps {
  deal?: ClientDeal;
  categories: Category[];
  retailers: Retailer[];
  mode: 'create' | 'edit';
  onSubmit: (formData: FormData) => Promise<{ success: boolean; message: string; errors?: Record<string, string> }>;
}

export default function DealForm({ deal, categories, retailers, mode, onSubmit }: DealFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [productName, setProductName] = useState(deal?.productName || '');
  const [description, setDescription] = useState(deal?.description || '');
  const [imageUrl, setImageUrl] = useState(deal?.imageUrl || '');
  const [dealUrl, setDealUrl] = useState(deal?.dealUrl || '');
  const [category, setCategory] = useState(deal?.category || '');
  const [retailer, setRetailer] = useState(deal?.retailer || '');
  const [price, setPrice] = useState(deal ? (deal.price / 100).toFixed(2) : '');
  const [originalPrice, setOriginalPrice] = useState(deal ? (deal.originalPrice / 100).toFixed(2) : '');
  const [expirationDate, setExpirationDate] = useState(() => {
    if (!deal?.expirationDate) return '';
    const date = deal.expirationDate instanceof Date 
      ? deal.expirationDate 
      : new Date(deal.expirationDate);
    return date.toISOString().slice(0, 16);
  });
  const [slug, setSlug] = useState(deal?.slug || '');
  const [isActive, setIsActive] = useState(deal?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(deal?.isFeatured ?? false);
  const [metaDescription, setMetaDescription] = useState(deal?.metaDescription || '');
  
  // Calculate savings percentage
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  
  useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const originalPriceNum = parseFloat(originalPrice) || 0;
    
    if (originalPriceNum > 0 && priceNum > 0 && priceNum < originalPriceNum) {
      const savings = calculateSavingsPercentage(
        Math.round(originalPriceNum * 100),
        Math.round(priceNum * 100)
      );
      setSavingsPercentage(savings);
    } else {
      setSavingsPercentage(0);
    }
  }, [price, originalPrice]);
  
  // Auto-generate slug from product name
  useEffect(() => {
    if (mode === 'create' && productName && !slug) {
      const generatedSlug = productName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [productName, mode, slug]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('imageUrl', imageUrl);
    formData.append('dealUrl', dealUrl);
    formData.append('category', category);
    formData.append('retailer', retailer);
    formData.append('price', Math.round(parseFloat(price) * 100).toString());
    formData.append('originalPrice', Math.round(parseFloat(originalPrice) * 100).toString());
    formData.append('expirationDate', new Date(expirationDate).toISOString());
    formData.append('slug', slug);
    formData.append('isActive', isActive.toString());
    formData.append('isFeatured', isFeatured.toString());
    if (metaDescription) {
      formData.append('metaDescription', metaDescription);
    }
    
    const result = await onSubmit(formData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        router.push('/deals');
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}
      
      {/* Product Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
        
        <div className="space-y-4">
          <Input
            id="productName"
            label="Product Name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            error={errors.productName}
            required
            maxLength={200}
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
              rows={4}
              maxLength={1000}
              required
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1.5 text-sm text-gray-500">{description.length}/1000 characters</p>
          </div>
          
          <Input
            id="imageUrl"
            label="Image URL"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            error={errors.imageUrl}
            helperText="Full URL to product image"
            required
          />
          
          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
              <img
                src={imageUrl}
                alt="Product preview"
                className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
          
          <Input
            id="dealUrl"
            label="Deal URL"
            type="url"
            value={dealUrl}
            onChange={(e) => setDealUrl(e.target.value)}
            error={errors.dealUrl}
            helperText="Link to the product on retailer's website"
            required
          />
        </div>
      </div>
      
      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="originalPrice"
            label="Original Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            error={errors.originalPrice}
            required
          />
          
          <Input
            id="price"
            label="Sale Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            required
          />
        </div>
        
        {/* Savings Display */}
        {savingsPercentage > 0 && (
          <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              Savings: {savingsPercentage}% off
            </p>
            <p className="text-green-700 text-sm mt-1">
              Save ${(parseFloat(originalPrice) - parseFloat(price)).toFixed(2)}
            </p>
          </div>
        )}
      </div>
      
      {/* Categorization */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </Select>
          
          <Select
            id="retailer"
            label="Retailer"
            value={retailer}
            onChange={(e) => setRetailer(e.target.value)}
            error={errors.retailer}
            required
          >
            <option value="">Select a retailer</option>
            {retailers.map((ret) => (
              <option key={ret.id} value={ret.slug}>
                {ret.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Deal Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Settings</h3>
        
        <div className="space-y-4">
          <Input
            id="expirationDate"
            label="Expiration Date"
            type="datetime-local"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            error={errors.expirationDate}
            required
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
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Active</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Featured</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* SEO */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO (Optional)</h3>
        
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
            rows={3}
            maxLength={160}
          />
          <p className="mt-1.5 text-sm text-gray-500">{metaDescription.length}/160 characters</p>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex items-center space-x-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Deal' : 'Update Deal'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/deals')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
