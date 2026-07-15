"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useGetCategories = () => {
  const trpc = useTRPC();

  const query = useQuery(trpc.categories.getCategories.queryOptions());

  return {
    ...query,
    categories: query.data ?? [],
  };
};

export const useGetCategory = (id?: string) => {
  const trpc = useTRPC();

  const query = useQuery(
    trpc.categories.getCategoryById.queryOptions(
      { id: id ?? "" },
      { enabled: Boolean(id) },
    ),
  );

  return {
    ...query,
    category: query.data ?? null,
  };
};

export const useCreateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.addCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.categories.pathFilter());
      },
    }),
  );
};

export const useUpdateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.editCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.categories.pathFilter());
      },
    }),
  );
};

export const useDeleteCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.removeCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.categories.pathFilter());
      },
    }),
  );
};

