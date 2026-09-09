"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { FileModal } from "./FileModal";

interface FileDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPasswordLocked: boolean;
    deletePassword: string;
    setDeletePassword: (val: string) => void;
    onDelete: (e: React.FormEvent) => void;
    deleting: boolean;
}

export const FileDeleteModal: React.FC<FileDeleteModalProps> = ({
    isOpen,
    onClose,
    isPasswordLocked,
    deletePassword,
    setDeletePassword,
    onDelete,
    deleting,
}) => {
    return (
        <FileModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span className="text-error flex items-center gap-2">
                    <Trash2 size={16} /> Delete File Package
                </span>
            }
        >
            <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                This action is permanent and will completely destroy the file package record and revoke download access.
            </p>

            <form onSubmit={onDelete} className="space-y-4 pt-1">
                {isPasswordLocked && (
                    <input
                        type="password"
                        required
                        placeholder="Enter password to confirm deletion"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="input input-sm w-full bg-base-200 border-base-300 rounded-xl text-xs"
                    />
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost btn-xs sm:btn-sm rounded-xl text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={deleting}
                        className="btn btn-error btn-xs sm:btn-sm rounded-xl text-white text-xs px-4 font-bold"
                    >
                        {deleting ? "Deleting..." : "Delete Permanently"}
                    </button>
                </div>
            </form>
        </FileModal>
    );
};