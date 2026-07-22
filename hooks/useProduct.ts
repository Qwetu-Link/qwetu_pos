"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

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

export const useCreateProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.addProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
            },
        }),
    );
};

export const useUpdateProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.editProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
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

export const useDeleteProduct = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.products.removeProduct.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
            },
        }),
    );
};
