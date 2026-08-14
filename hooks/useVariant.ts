"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useOfflineMutation } from "./useOfflineMutation";

export const useGetVariants = () => {
    const trpc = useTRPC();

    const query = useQuery(trpc.variants.getVariants.queryOptions());

    return {
        ...query,
        variants: query.data ?? [],
    };
};

export const useGetVariant = (id?: string) => {
    const trpc = useTRPC();

    const query = useQuery(
        trpc.variants.getVariantById.queryOptions(
            { id: id ?? "" },
            { enabled: Boolean(id) },
        ),
    );

    return {
        ...query,
        variant: query.data ?? null,
    };
};

export const useCreateVariant = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.variants.addVariant.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
        { procedure: "variants.addVariant", label: "Create variant" },
    );
};

export const useUpdateVariant = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.variants.editVariant.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
        { procedure: "variants.editVariant", label: "Update variant" },
    );
};

export const useDeleteVariant = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.variants.removeVariant.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.variants.pathFilter());
                await queryClient.invalidateQueries(trpc.products.pathFilter());
            },
        }),
        { procedure: "variants.removeVariant", label: "Delete variant" },
    );
};
