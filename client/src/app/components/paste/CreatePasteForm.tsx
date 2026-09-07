'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Type,
    Lock,
    Link as LinkIcon,
    Clock,
    Eye,
    Send,
    AlertCircle
} from 'lucide-react';

// Form interface matching your API payload shape
interface CreatePasteFormData {
    title: string;
    content: string;
    ttl: number;
    slug?: string;
    password?: string;
    maxViews?: number;
}

export function CreatePasteForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CreatePasteFormData>({
        defaultValues: {
            title: '',
            content: '',
            ttl: 7,
            slug: '',
            password: '',
        }
    });

    const contentValue = watch('content') || '';

    const onSubmit = async (data: CreatePasteFormData) => {
        // Clean payload: delete optional empty strings before sending
        const payload = { ...data };
        if (!payload.slug?.trim()) delete payload.slug;
        if (!payload.password?.trim()) delete payload.password;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pastes/create-paste`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const result = await res.json();

            if (!res.ok) {
                // If backend Zod fails, display the backend message
                throw new Error(result.message || 'Failed to create paste.');
            }


            const createdSlug = result.data?.slug || payload.slug;
            router.push(`/paste/${createdSlug}`);
        } catch (err) {
            const error = err as Error;
            // Set root error to display message from backend
            setError('root', { message: error.message });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Backend / Submission Errors */}
            {errors.root && (
                <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-2xl flex items-center gap-2">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errors.root.message}</span>
                </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                    <Type size={16} /> Title <span className="text-error">*</span>
                </label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    placeholder="e.g. Express Middleware Snippet"
                    className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-primary text-sm"
                />
                {errors.title && (
                    <p className="text-xs text-error mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-base-content/80">
                        Paste Content <span className="text-error">*</span>
                    </label>
                    <span className="text-xs text-base-content/50 font-mono">
                        {contentValue.length} characters
                    </span>
                </div>
                <textarea
                    {...register('content', { required: 'Content is required' })}
                    rows={10}
                    placeholder="Paste code or plain text here..."
                    className="textarea textarea-bordered w-full rounded-2xl font-mono text-sm leading-relaxed focus:outline-none focus:border-primary resize-y"
                ></textarea>
                {errors.content && (
                    <p className="text-xs text-error mt-1">{errors.content.message}</p>
                )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Expiration TTL */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                        <Clock size={16} /> Expiration <span className="text-error">*</span>
                    </label>
                    <select
                        {...register('ttl', { valueAsNumber: true })}
                        className="select select-bordered w-full rounded-2xl focus:outline-none focus:border-primary text-sm"
                    >
                        <option value={1}>1 Day</option>
                        <option value={3}>3 Days</option>
                        <option value={7}>7 Days</option>
                        <option value={10}>10 Days</option>
                        <option value={15}>15 Days</option>
                    </select>
                </div>

                {/* Custom Slug */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                        <LinkIcon size={16} /> Custom URL Slug (Optional)
                    </label>
                    <input
                        {...register('slug', {
                            pattern: {
                                value: /^[a-zA-Z0-9_-]+$/,
                                message: 'Only letters, numbers, hyphens, and underscores allowed'
                            }
                        })}
                        type="text"
                        placeholder="e.g. my-custom-link"
                        className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-primary text-sm font-mono"
                    />
                    {errors.slug && (
                        <p className="text-xs text-error mt-1">{errors.slug.message}</p>
                    )}
                </div>

                {/* Password Protection */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                        <Lock size={16} /> Password Protection (Optional)
                    </label>
                    <input
                        {...register('password', {
                            minLength: {
                                value: 4,
                                message: 'Password must be at least 4 characters long'
                            }
                        })}
                        type="password"
                        placeholder="Set password"
                        className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-primary text-sm"
                    />
                    {errors.password && (
                        <p className="text-xs text-error mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Max Views Limit */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                        <Eye size={16} /> View Limit (Optional)
                    </label>
                    <input
                        {...register('maxViews', {
                            setValueAs: (v) => (v === '' ? undefined : Number(v)),
                            min: {
                                value: 1,
                                message: 'Max views must be at least 1'
                            }
                        })}
                        type="number"
                        placeholder="e.g. 5 views then delete"
                        className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-primary text-sm"
                    />
                    {errors.maxViews && (
                        <p className="text-xs text-error mt-1">{errors.maxViews.message}</p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full rounded-2xl gap-2 font-semibold text-base shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <>
                            <Send size={18} /> Create Paste
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}