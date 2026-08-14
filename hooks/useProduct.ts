"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useOfflineMutation } from "./useOfflineMutation";

export const useGetProducts = () => {
    const trpc = useTRPC();

    const query = useQuery(trpc.products.getProducts.queryOptions());

    return {
        ...query,
        products: query.data ?? [],
    };
};

export const useGetProduct = (id?: string) => {
    const trpc = useTRPC();

    const query = useQuery(
        trpc.products.getProductById.queryOptions(
            { id: id ?? "" },
            { enabled: Boolean(id) },
        ),
    );

    return {
        ...query,
        product: query.data ?? null,
    };
};

export const useGetProductDetails = (id?: string) => {
    const trpc = useTRPC();

    const query = useQuery(
        trpc.products.getProductDetails.queryOptions(
            { id: id ?? "" },
            { enabled: Boolean(id) },
        ),
    );

    return {
        ...query,
        product: query.data ?? null,
    };
};

export const useCreateProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.products.addProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
            },
        }),
        { procedure: "products.addProduct", label: "Create product" },
    );
};

export const useUpdateProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.products.editProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
        { procedure: "products.editProduct", label: "Update product" },
    );
};

export const useUploadProductImage = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.uploadProductImage.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
    );
};

export const useReplaceProductImages = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.replaceProductImages.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
    );
};

export const useRemoveProductImages = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.removeProductImages.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
    );
};

export const useSaveUploadedProductImages = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.saveUploadedProductImages.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
    );
};

export const useDeleteProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.products.removeProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
            },
        }),
        { procedure: "products.removeProduct", label: "Delete product" },
    );
};
