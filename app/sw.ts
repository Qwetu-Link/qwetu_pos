import {
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
    runtimeCaching: defaultCache,
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

// const serwist = new Serwist({
//   precacheEntries: self.__SW_MANIFEST,
//   runtimeCaching: defaultCache,
//   skipWaiting: true,
//   clientsClaim: true,
//   navigationPreload: true,
// });

// serwist.registerCapture(
//   /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
//   new CacheFirst({
//     cacheName: "images",
//   }),
// );

// serwist.registerCapture(
//   ({ request }) => request.destination === "document",
//   new NetworkFirst({
//     cacheName: "pages",
//   }),
// );

// serwist.registerCapture(
//   ({ request }) =>
//     request.destination === "style" || request.destination === "script",
//   new StaleWhileRevalidate({
//     cacheName: "assets",
//   }),
// );

// serwist.addEventListeners();




// declare const self: ServiceWorkerGlobalScope & {
//   // Change this attribute's name to your `injectionPoint`.
//   // `injectionPoint` is an InjectManifest option.
//   // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
//   __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// };

// const revision = crypto.randomUUID();

// installSerwist({
//   precacheEntries: self.__SW_MANIFEST,
//   skipWaiting: true,
//   clientsClaim: true,
//   navigationPreload: true,
//   runtimeCaching: defaultCache,
//   fallbacks: {
//     entries: [
//       {
//         url: '/offline',
//         revision,
//         matcher({ request }) {
//           return request.destination === 'document';
//         },
//       },
//     ],
//   },
//   importScripts: ['custom-sw.js'],
// });