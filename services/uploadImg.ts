import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

const supabase =
    supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type StorageError = {
    message?: string;
    error?: string;
    statusCode?: string | number;
};

function getStorageErrorMessage(error: StorageError, operation: "upload" | "delete") {
    const rawMessage = error.message || error.error || "Unknown storage error.";
    const statusCode = Number(error.statusCode);

    if (statusCode === 401 || statusCode === 403) {
        return "Supabase storage rejected the request. Check the storage service role key and bucket permissions.";
    }

    if (statusCode === 404 || rawMessage.toLowerCase().includes("bucket not found")) {
        return "Supabase storage bucket 'products' was not found.";
    }

    if (statusCode === 413 || rawMessage.toLowerCase().includes("payload too large")) {
        return "Supabase storage rejected the image because the uploaded file is too large.";
    }

    if (statusCode === 409 || rawMessage.toLowerCase().includes("already exists")) {
        return "Supabase storage already has an image at the generated upload path. Please retry.";
    }

    return `Supabase storage ${operation} failed: ${rawMessage}`;
}

export async function uploadImage(
    path: string,
    buffer: Buffer,
    contentType = "image/webp",
) {
    if (!supabase) {
        throw new Error(
            "Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        );
    }

    const { error } =
        await supabase.storage
            .from("products")
            .upload(path, buffer, {
                contentType,
            });

    if (error) {
        throw new Error(`Image storage upload failed. ${getStorageErrorMessage(error, "upload")}`);
    }
}

export async function deleteImages(paths: string[]) {
    if (paths.length === 0) {
        return;
    }

    if (!supabase) {
        throw new Error(
            "Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        );
    }

    const { error } = await supabase.storage
        .from("products")
        .remove(paths);

    if (error) {
        throw new Error(`Image storage cleanup failed. ${getStorageErrorMessage(error, "delete")}`);
    }
}
