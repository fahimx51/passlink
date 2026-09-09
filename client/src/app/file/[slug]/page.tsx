"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/common/Navbar";
import {
    getFileDetails,
    getDownloadUrl,
    deleteFileRecord,
    updateFileRecord,
    FileMetadata,
} from "@/api/fileApi";
import { FileArchive, Download, AlertCircle, ShieldAlert, Copy, Check, Settings } from "lucide-react";
import { FileHeader } from "@/app/components/file/FileHeader";
import { FileStats } from "@/app/components/file/FileStats";
import { FileDownloadModal } from "@/app/components/file/FileDownloadModal";
import { FileDeleteModal } from "@/app/components/file/FileDeleteModal";
import { FileModal } from "@/app/components/file/FileModal";
import { FormSettingsGrid } from "@/app/components/file/FormSettingsGrid";
import { FilePageSkeleton } from "@/app/components/file/FilePageSkeleton";

interface SharePageProps {
    params: Promise<{ slug: string }>;
}

export default function SharePage({ params }: SharePageProps) {
    const { slug } = use(params);
    const router = useRouter();

    const [fileData, setFileData] = useState<FileMetadata | null>(null);
    const [downloadPassword, setDownloadPassword] = useState<string>("");
    const [deletePassword, setDeletePassword] = useState<string>("");

    // Update form states
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [updateTtl, setUpdateTtl] = useState<number>(7);
    const [updateNewPassword, setUpdateNewPassword] = useState<string>("");
    const [updateNewSlug, setUpdateNewSlug] = useState<string>("");
    const [updateDownloadLimit, setUpdateDownloadLimit] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [modalError, setModalError] = useState<string>("");
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        getFileDetails(slug)
            .then((data) => {
                if (isMounted) {
                    setFileData(data);
                    setError("");
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load package details.");
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [slug]);

    useEffect(() => {
        if (!fileData?.expiresAt) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const expiry = new Date(fileData.expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeRemaining("Expired");
                setIsExpired(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) setTimeRemaining(`${days}d ${hours}h left`);
            else if (hours > 0) setTimeRemaining(`${hours}h ${minutes}m left`);
            else if (minutes > 0) setTimeRemaining(`${minutes}m ${seconds}s left`);
            else setTimeRemaining(`${seconds}s left`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [fileData]);

    const handleOpenUpdateModal = () => {
        if (fileData) {
            setUpdateNewSlug(fileData.slug);
            setUpdateDownloadLimit(fileData.downloadLimit ? String(fileData.downloadLimit) : "");
            setCurrentPassword("");
            setUpdateNewPassword("");
            setModalError("");
            setIsUpdateModalOpen(true);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setModalError("");

        try {
            const payload = {
                password: currentPassword || undefined,
                newPassword: updateNewPassword !== "" ? updateNewPassword : undefined,
                ttl: updateTtl,
                newSlug: updateNewSlug.trim() !== slug ? updateNewSlug.trim() : undefined,
                downloadLimit: updateDownloadLimit ? Number(updateDownloadLimit) : null,
            };

            const updated = await updateFileRecord(slug, payload);
            setFileData(updated);
            setIsUpdateModalOpen(false);

            if (updated.slug !== slug) {
                router.push(`/file/${updated.slug}`);
            }
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to update file settings.");
        } finally {
            setUpdating(false);
        }
    };

    const handleInitialDownloadClick = () => {
        if (fileData?.isPasswordLocked) {
            setModalError("");
            setIsDownloadModalOpen(true);
        } else {
            executeDownload();
        }
    };

    const executeDownload = async () => {
        setDownloading(true);
        setError("");
        setModalError("");

        try {
            const { downloadUrl, fileName } = await getDownloadUrl(slug, downloadPassword);
            const response = await fetch(downloadUrl);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            setIsDownloadModalOpen(false);
            const updated = await getFileDetails(slug);
            setFileData(updated);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to generate download link.";
            if (fileData?.isPasswordLocked) setModalError(msg);
            else setError(msg);
        } finally {
            setDownloading(false);
        }
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!downloadPassword.trim()) {
            setModalError("Please enter the password to download this file.");
            return;
        }
        executeDownload();
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleting(true);

        try {
            await deleteFileRecord(slug, deletePassword);
            setIsDeleteModalOpen(false);
            setFileData(null);
            setError("Package has been permanently deleted.");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete package.");
        } finally {
            setDeleting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Render full skeleton layout while loading
    if (loading) {
        return <FilePageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-base-300 text-base-content flex flex-col font-sans transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/10 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />

                <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl bg-base-100/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-base-200 shadow-2xl overflow-hidden relative p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                    {error && !fileData ? (
                        <div className="py-10 sm:py-14 text-center space-y-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-error/10 text-error rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center border border-error/20">
                                <ShieldAlert size={32} className="sm:w-9 sm:h-9" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg sm:text-xl font-bold">Access Denied</h3>
                                <p className="text-xs opacity-70 max-w-xs mx-auto">{error}</p>
                            </div>
                        </div>
                    ) : (
                        fileData && (
                            <>
                                <FileHeader
                                    slug={slug}
                                    isExpired={isExpired}
                                    onOpenUpdateModal={handleOpenUpdateModal}
                                    onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
                                />

                                <div className="space-y-6 sm:space-y-8">
                                    <div className="text-center space-y-3 sm:space-y-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 text-primary rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center border border-primary/20 shadow-inner">
                                            <FileArchive size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
                                        </div>
                                        <div className="space-y-1 max-w-sm sm:max-w-md mx-auto">
                                            <h2
                                                className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-base-content truncate"
                                                title={fileData.fileName}
                                            >
                                                {fileData.fileName}
                                            </h2>
                                            <p className="text-[11px] sm:text-xs font-mono opacity-60">
                                                Ready for secure download
                                            </p>
                                        </div>
                                    </div>

                                    <FileStats
                                        fileData={fileData}
                                        timeRemaining={timeRemaining}
                                        isExpired={isExpired}
                                        formatBytes={formatBytes}
                                    />

                                    {error && (
                                        <div className="alert alert-error text-xs rounded-xl sm:rounded-2xl py-2.5 flex items-center gap-2">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 sm:gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleInitialDownloadClick}
                                            disabled={downloading || isExpired}
                                            className="group relative flex-1 h-11 sm:h-12 bg-primary text-primary-content hover:bg-primary/90 active:scale-[0.98] disabled:bg-base-300 disabled:text-base-content/40 disabled:cursor-not-allowed disabled:shadow-none border-none rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 transition-all duration-200 overflow-hidden"
                                        >
                                            {downloading ? (
                                                <div className="flex items-center justify-center gap-2.5 w-full h-full px-4">
                                                    <span
                                                        className="loading loading-spinner loading-xs sm:loading-sm shrink-0"
                                                        style={{ color: "currentColor" }}
                                                    />
                                                    <span className="text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
                                                        Preparing Download...
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full h-full px-4">
                                                    <div className="p-1 sm:p-1.5 rounded-lg bg-primary-content/20 text-primary-content flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                                                        <Download size={15} className="sm:w-4 sm:h-4 stroke-[2.5]" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                                                        {isExpired ? "Package Expired" : "Download File"}
                                                    </span>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="btn btn-outline border-base-300 hover:border-primary h-10 sm:h-12 rounded-xl px-3 sm:px-4"
                                            title="Copy Share Link"
                                        >
                                            {copied ? (
                                                <Check size={16} className="text-success sm:w-5 sm:h-5" />
                                            ) : (
                                                <Copy size={16} className="sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>
            </main>

            <FileDownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                downloadPassword={downloadPassword}
                setDownloadPassword={setDownloadPassword}
                onSubmit={handleModalSubmit}
                downloading={downloading}
                modalError={modalError}
            />

            <FileDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                isPasswordLocked={!!fileData?.isPasswordLocked}
                deletePassword={deletePassword}
                setDeletePassword={setDeletePassword}
                onDelete={handleDelete}
                deleting={deleting}
            />

            <FileModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                title={
                    <span className="text-primary flex items-center gap-2">
                        <Settings size={16} /> Edit File Settings
                    </span>
                }
            >
                <form onSubmit={handleUpdate} className="space-y-4 pt-1">
                    {fileData?.isPasswordLocked && (
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-xs font-medium text-base-content/70">
                                    Current Password (Required)
                                </span>
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Enter current password to save changes"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input input-sm w-full bg-base-200 border-base-300 rounded-xl text-xs focus:input-primary"
                            />
                        </div>
                    )}

                    <FormSettingsGrid
                        ttl={updateTtl}
                        setTtl={setUpdateTtl}
                        password={updateNewPassword}
                        setPassword={setUpdateNewPassword}
                        slug={updateNewSlug}
                        setSlug={setUpdateNewSlug}
                        downloadLimit={updateDownloadLimit}
                        setDownloadLimit={setUpdateDownloadLimit}
                    />

                    {modalError && (
                        <div className="alert alert-error text-xs rounded-xl py-2 flex items-center gap-2">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{modalError}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="btn btn-ghost btn-xs sm:btn-sm rounded-xl text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="btn btn-primary btn-xs sm:btn-sm text-primary-content rounded-xl text-xs px-4 font-bold"
                        >
                            {updating ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </FileModal>
        </div>
    );
}