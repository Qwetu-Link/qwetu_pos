import sharp from "sharp";
// import fs from "fs/promises";
import path from "path";

const WATERMARK_FIXED_WIDTH = 150;

export async function optimizeImage(buffer: Buffer) {
    return sharp(buffer)
        .resize({
            width: 1600,
            withoutEnlargement: true,
        })
        .webp({
            quality: 85,
        })
        .toBuffer();
}

export async function createThumbnail(buffer: Buffer) {
    return sharp(buffer)
        .resize({
            width: 400,
            height: 400,
            fit: "cover",
        })
        .webp({
            quality: 80,
        })
        .toBuffer();
}

export async function createWatermarked(buffer: Buffer) {
    const image = sharp(buffer);

    try {
        const watermarkPath = path.join(process.cwd(), "public/icon1.png");
        const baseMeta = await image.metadata();
        const baseWidth = baseMeta.width;
        const baseHeight = baseMeta.height;

        if (!baseWidth || !baseHeight) {
            throw new Error("Could not read image dimensions.");
        }

        const targetWidth = Math.min(WATERMARK_FIXED_WIDTH, baseWidth);
        const watermarkResized = await sharp(watermarkPath)
            .resize({
                width: targetWidth,
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();

        const watermarkMeta = await sharp(watermarkResized).metadata();
        const finalWatermark =
            watermarkMeta.height && watermarkMeta.height > baseHeight
                ? await sharp(watermarkPath)
                    .resize({
                        height: baseHeight,
                        fit: "inside",
                        withoutEnlargement: true,
                    })
                    .toBuffer()
                : watermarkResized;

        return image
            .composite([
                {
                    input: finalWatermark,
                    gravity: "southeast",
                },
            ])
            .webp({
                quality: 85,
            })
            .toBuffer();
    } catch (error) {
        const nodeError = error as NodeJS.ErrnoException;

        if (nodeError.code !== "ENOENT") {
            throw error;
        }

        return image
            .webp({
                quality: 85,
            })
            .toBuffer();
    }
}

export async function getImageMetadata(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata();

    return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
    };
}
