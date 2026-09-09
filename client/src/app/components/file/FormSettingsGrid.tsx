"use client";

import React from "react";
import { Clock, Lock, Link as LinkIcon, Hash } from "lucide-react";

interface FormSettingsGridProps {
    ttl: number;
    setTtl: (val: number) => void;
    password: string;
    setPassword: (val: string) => void;
    slug: string;
    setSlug: (val: string) => void;
    downloadLimit: string;
    setDownloadLimit: (val: string) => void;
}

export function FormSettingsGrid({
    ttl,
    setTtl,
    password,
    setPassword,
    slug,
    setSlug,
    downloadLimit,
    setDownloadLimit,
}: FormSettingsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/70 flex items-center gap-1.5">
                        <Clock size={13} /> Link TTL Expiry
                    </span>
                </label>
                <select
                    value={ttl}
                    onChange={(e) => setTtl(Number(e.target.value))}
                    className="select select-bordered select-sm w-full text-xs bg-base-100 rounded-xl focus:outline-none focus:border-primary"
                >
                    <option value={1}>1 Day Expiration</option>
                    <option value={3}>3 Days Expiration</option>
                    <option value={7}>7 Days Expiration</option>
                </select>
            </div>

            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/70 flex items-center gap-1.5">
                        <Lock size={13} /> Access Password
                    </span>
                </label>
                <input
                    type="password"
                    placeholder="Optional protection"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered input-sm w-full text-xs bg-base-100 rounded-xl focus:outline-none focus:border-primary"
                />
            </div>

            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/70 flex items-center gap-1.5">
                        <LinkIcon size={13} /> Custom URL Path
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="e.g. key-files"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input input-bordered input-sm w-full text-xs bg-base-100 rounded-xl focus:outline-none focus:border-primary"
                />
            </div>

            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/70 flex items-center gap-1.5">
                        <Hash size={13} /> Max Downloads
                    </span>
                </label>
                <input
                    type="number"
                    min={1}
                    placeholder="Unlimited if empty"
                    value={downloadLimit}
                    onChange={(e) => setDownloadLimit(e.target.value)}
                    className="input input-bordered input-sm w-full text-xs bg-base-100 rounded-xl focus:outline-none focus:border-primary"
                />
            </div>
        </div>
    );
}