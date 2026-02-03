/**
 * RetailerForm Component
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Retailer } from '../../lib/types';

interface RetailerFormProps {
  retailer?: Retailer;
  mode: 'create' | 'edit';
  onSubmit: (formData: FormData) => Promise<{ success: boolean; message: string; errors?: Record<string, string> }>;
}

export default function RetailerForm({ retailer, mode, onSubmit }: RetailerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [name, setName] = useState(retailer?.name || '');
  const [slug, setSlug] = useState(retailer?.slug || '');
  const [logoUrl, setLogoUrl] = useState(retailer?.logoUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(retailer?.websiteUrl || '');
  const [affiliateId, setAffiliateId] = useState(retailer?.affiliateId || '');
  const [commission, setCommission] = useState(retailer?.commission || '');
  const [isActive, setIsActive] = useState(retailer?.isActive ?? true);
  
  useEffect(() => {
    if (mode === 'create' && name && !slug) {
      const generatedSlug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
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
    formData.append('logoUrl', logoUrl);
    formData.append('websiteUrl', websiteUrl);
    formData.append('affiliateId', affiliateId);
    formData.append('commission', commission);
    formData.append('isActive', isActive.toString());
    
    const result = await onSubmit(formData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => router.push('/retailers'), 1500);
    } else {
      setErrors(result.errors || { general: result.message });
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">{successMessage}</div>
      )}
      {errors.general && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">{errors.general}</div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Retailer Information</h3>
        <div className="space-y-4">
          <Input id="name" label="Retailer Name" type="text" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required maxLength={100} />
          <Input id="slug" label="URL Slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} error={errors.slug} helperText="URL-friendly identifier" required />
          <Input id="logoUrl" label="Logo URL" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} error={errors.logoUrl} required />
          <Input id="websiteUrl" label="Website URL" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} error={errors.websiteUrl} required />
          <Input id="affiliateId" label="Affiliate ID (Optional)" type="text" value={affiliateId} onChange={(e) => setAffiliateId(e.target.value)} />
          <Input id="commission" label="Commission" type="text" value={commission} onChange={(e) => setCommission(e.target.value)} error={errors.commission} helperText="e.g., 5% or $10 per sale" required />
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Active</span>
          </label>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Retailer' : 'Update Retailer'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/retailers')} disabled={isSubmitting}>Cancel</Button>
      </div>
    </form>
  );
}
