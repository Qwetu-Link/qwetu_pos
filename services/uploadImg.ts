import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

const supabase =
    supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

    if (error)
        throw error;
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
        throw error;
    }
}
