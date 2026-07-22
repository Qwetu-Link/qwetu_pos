import { processImage, ProductImageUpload } from "./processImg";
import { deleteImages } from "./uploadImg";

export async function uploadProductImages(
    files: ProductImageUpload[],
    productId: string,
    businessId: string,
) {
    const images = [];
    const uploadedPaths: string[] = [];

    try {
        for (const file of files) {
            const image = await processImage({
                file,
                productId,
                businessId,
            });

            images.push(image);
            uploadedPaths.push(...image.uploadedPaths);
        }

        return images;
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }
}

export function getUploadedProductImagePaths(
    images: Awaited<ReturnType<typeof uploadProductImages>>,
) {
    return images.flatMap((image) => image.uploadedPaths);
}
