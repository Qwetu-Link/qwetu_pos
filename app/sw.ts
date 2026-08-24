import {
    CacheFirst,
    ExpirationPlugin,
    Serwist,
    type PrecacheEntry,
    type SerwistGlobalConfig,
} from "serwist";
// import type { PrecacheEntry } from '@serwist/precaching';
import { defaultCache } from "@serwist/next/worker";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    precacheOptions: {
        cleanupOutdatedCaches: true,
    },
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher: ({ request, url }) =>
                request.destination === "image" &&
                url.pathname.startsWith("/storage/v1/object/public/products/"),
            method: "GET",
            handler: new CacheFirst({
                cacheName: "supabase-product-images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 256,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        maxAgeFrom: "last-used",
                    }),
                ],
            }),
        },
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: '/~offline',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});

serwist.addEventListeners();