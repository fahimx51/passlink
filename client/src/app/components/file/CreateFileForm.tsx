"use client";

import React, { useState, useSyncExternalStore } from "react";
import JSZip from "jszip";
import { AlertCircle, Sparkles } from "lucide-react";
import { registerFileRecord, uploadFileToCloudinary } from "@/api/fileApi";
import { UploadSuccessCard } from "./UploadSuccessCard";
import { FileListQueue } from "./FileListQueue";
import { FileDropzone } from "./FileDropZone";
import { FormSettingsGrid } from "./FormSettingsGrid";

export function CreateFileForm() {
    const [files, setFiles] = useState<File[]>([]);
    const [ttl, setTtl] = useState<number>(7);
    const [password, setPassword] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [downloadLimit, setDownloadLimit] = useState<string>("");

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [shareUrl, setShareUrl] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const isMounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    const MAX_TOTAL_SIZE = 9.5 * 1024 * 1024;

    const handleFilesAdded = (incomingFiles: FileList | File[]) => {
        const selected = Array.from(incomingFiles);
        const combined = [...files, ...selected];
        const totalSize = combined.reduce((acc, f) => acc + f.size, 0);

        if (totalSize > MAX_TOTAL_SIZE) {
            setError("Total file size exceeds the 9.5 MB limit for raw uploads.");
            return;
        }

        setError("");
        setFiles(combined);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const updated = files.filter((_, idx) => idx !== indexToRemove);
        setFiles(updated);
        if (updated.reduce((acc, f) => acc + f.size, 0) <= MAX_TOTAL_SIZE) {
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError("Please attach at least one file.");
            return;
        }

        try {
            setIsUploading(true);
            setError("");
            setProgress(0);

            let uploadBlob: File;

            if (files.length === 1 && files[0].name.toLowerCase().endsWith(".zip")) {
                uploadBlob = files[0];
            } else {
                setStatusText("Packaging into ZIP archive (No Compression)...");

                const zip = new JSZip();
                files.forEach((file) => zip.file(file.name, file));

                const zipBlob = await zip.generateAsync(
                    {
                        type: "blob",
                        compression: "STORE",
                    },
                    (meta: { percent: number }) => {
                        setProgress(Math.round(meta.percent));
                    }
                );

                if (zipBlob.size > 10 * 1024 * 1024) {
                    throw new Error("ZIP file exceeds Cloudinary's 10 MB limit.");
                }

                const zipName = files.length === 1 ? `${files[0].name.split(".")[0]}.zip` : "shared-files.zip";
                uploadBlob = new window.File([zipBlob], zipName, { type: "application/zip" });
            }

            setStatusText("Registering metadata with backend...");
            setProgress(0);

            const { publicId, slug: generatedSlug } = await registerFileRecord({
                fileName: uploadBlob.name,
                fileSize: uploadBlob.size,
                ttl,
                password: password || undefined,
                slug: slug || undefined,
                downloadLimit: downloadLimit ? parseInt(downloadLimit, 10) : undefined,
            });

            setStatusText("Streaming archive directly to Cloudinary...");
            await uploadFileToCloudinary(uploadBlob, publicId, (pct) => setProgress(pct));

            setShareUrl(`${window.location.origin}/file/${generatedSlug}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred during upload.");
        } finally {
            setIsUploading(false);
            setStatusText("");
        }
    };

    const totalSelectedSize = files.reduce((acc, f) => acc + f.size, 0);
    const sizePercentage = Math.min((totalSelectedSize / MAX_TOTAL_SIZE) * 100, 100);

    if (shareUrl) {
        return (
            <UploadSuccessCard
                shareUrl={shareUrl}
                onReset={() => {
                    setShareUrl("");
                    setFiles([]);
                }}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FileDropzone
                onFilesAdded={handleFilesAdded}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
            />

            <FileListQueue
                files={files}
                totalSelectedSize={totalSelectedSize}
                maxSize={MAX_TOTAL_SIZE}
                sizePercentage={sizePercentage}
                onRemoveFile={handleRemoveFile}
            />

            <FormSettingsGrid
                ttl={ttl}
                setTtl={setTtl}
                password={password}
                setPassword={setPassword}
                slug={slug}
                setSlug={setSlug}
                downloadLimit={downloadLimit}
                setDownloadLimit={setDownloadLimit}
            />

            {isUploading && (
                <div className="space-y-2 bg-base-200/50 p-3 rounded-2xl border border-base-300/60">
                    <div className="flex justify-between items-center text-xs font-medium text-base-content/70">
                        <span className="flex items-center gap-1.5">
                            <Sparkles size={13} className="text-primary animate-spin" />
                            {statusText}
                        </span>
                        <span className="font-mono text-primary font-bold">{progress}%</span>
                    </div>
                    <progress className="progress progress-primary w-full h-1.5" value={progress} max="100" />
                </div>
            )}

            {error && (
                <div className="alert alert-error text-xs shadow-lg rounded-2xl border border-error/20 flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                suppressHydrationWarning
                disabled={Boolean(!isMounted || isUploading || files.length === 0)}
                className="w-full h-11 bg-primary text-primary-content hover:bg-primary/90 active:scale-[0.99] disabled:bg-base-300 disabled:text-base-content/30 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-primary/20 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
                {isUploading ? (
                    <>
                        <span
                            className="loading loading-spinner loading-xs sm:loading-sm shrink-0"
                            style={{ color: "currentColor" }}
                        />
                        <span className="font-semibold tracking-wide">Processing Package...</span>
                    </>
                ) : (
                    "Build Share Link"
                )}
            </button>
        </form>
    );
}