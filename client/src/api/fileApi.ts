const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/files`
    : "http://localhost:8000/api/files";

export interface FileMetadata {
    id: string;
    slug: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    isPasswordLocked: boolean;
    downloadCount: number;
    downloadLimit: number | null;
    expiresAt: string;
    createdAt: string;
}

export interface UploadPayload {
    fileName: string;
    fileSize: number;
    ttl: number;
    password?: string;
    slug?: string;
    downloadLimit?: number;
}

export interface RegisterResponse {
    publicId: string;
    slug: string;
    cloudName: string;
}

export interface UpdatePayload {
    password?: string;
    newPassword?: string;
    ttl?: number;
    downloadLimit?: number | null;
    newSlug?: string;
}

async function handleResponse<T>(response: globalThis.Response): Promise<T> {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const errorMsg = data?.error?.message || data?.message || "An unexpected error occurred.";
        throw new Error(errorMsg);
    }

    return data;
}

export const registerFileRecord = async (payload: UploadPayload): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const result = await handleResponse<{ data: RegisterResponse }>(response);
    return result.data;
};

export const uploadFileToCloudinary = (
    file: File,
    publicId: string,
    onProgress: (progress: number) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            return reject(new Error("Cloudinary environment variables are missing."));
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("public_id", publicId);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error during file upload to Cloudinary."));

        // Changed /auto/upload to /raw/upload
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, true);
        xhr.send(formData);
    });
};

export const getFileDetails = async (slug: string): Promise<FileMetadata> => {
    const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const result = await handleResponse<{ data: { fileRecord: FileMetadata } }>(response);
    return result.data.fileRecord;
};

export const getDownloadUrl = async (slug: string, password?: string) => {
    const response = await fetch(`${API_BASE_URL}/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    const result = await handleResponse<{ data: { downloadUrl: string; fileName: string } }>(response);
    return result.data;
};

export const deleteFileRecord = async (slug: string, password?: string) => {
    const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    return await handleResponse(response);
};

export const updateFileRecord = async (slug: string, payload: UpdatePayload): Promise<FileMetadata> => {
    const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const result = await handleResponse<{ data: { fileRecord: FileMetadata } }>(response);
    return result.data.fileRecord;
};