import {
    createThumbnail,
    createWatermarked,
    getImageMetadata,
    optimizeImage,
} from "@/lib/sharp";
import crypto from "crypto";
import { deleteImages, uploadImage } from "./uploadImg";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const maxFileSize = 5 * 1024 * 1024;
const minDimension = 200;
const maxDimension = 6000;

export type ProductImageUpload = {
    buffer: Buffer;
    mimeType: string;
    fileSize: number;
};

function validateImageInput({ fileSize, mimeType }: ProductImageUpload) {
    if (!allowedMimeTypes.has(mimeType)) {
        throw new Error("Only JPEG, PNG, and WEBP product images are allowed.");
    }

    if (fileSize > maxFileSize) {
        throw new Error("Product images must be 5MB or smaller.");
    }
}

function validateDimensions(width?: number, height?: number) {
    if (!width || !height) {
        throw new Error("Could not read image dimensions.");
    }

    if (
        width < minDimension ||
        height < minDimension ||
        width > maxDimension ||
        height > maxDimension
    ) {
        throw new Error(
            `Product images must be between ${minDimension}x${minDimension} and ${maxDimension}x${maxDimension}px.`,
        );
    }
}

export async function processImage({
    file,
    productId,
    businessId,
}: {
    file: ProductImageUpload;
    productId: string;
    businessId: string;
}) {
    validateImageInput(file);

    const metadata = await getImageMetadata(file.buffer);
    validateDimensions(metadata.width, metadata.height);

    const optimized = await optimizeImage(file.buffer);
    const thumbnail = await createThumbnail(file.buffer);
    const watermark = await createWatermarked(file.buffer);
    const id = crypto.randomUUID();

    const originalPath =
        `products/${businessId}/${productId}/original/${id}.webp`;
    const optimizedPath =
        `products/${businessId}/${productId}/optimized/${id}.webp`;
    const thumbnailPath =
        `products/${businessId}/${productId}/thumbnail/${id}.webp`;
    const watermarkPath =
        `products/${businessId}/${productId}/watermarked/${id}.webp`;

    const uploadedPaths: string[] = [];

    try {
        await uploadImage(originalPath, optimized);
        uploadedPaths.push(originalPath);

        await uploadImage(optimizedPath, optimized);
        uploadedPaths.push(optimizedPath);

        await uploadImage(thumbnailPath, thumbnail);
        uploadedPaths.push(thumbnailPath);

        await uploadImage(watermarkPath, watermark);
        uploadedPaths.push(watermarkPath);
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }

    return {
        originalPath,
        optimizedPath,
        thumbnailPath,
        watermarkPath,
        width: metadata.width,
        height: metadata.height,
        fileSize: optimized.length,
        mimeType: "image/webp",
        uploadedPaths,
    };
}
