"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useGetRoles = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.settingsAccess.getRoles.queryOptions());

    return {
        ...query,
        roles: query.data ?? [],
    };
};

export const useCreateRole = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.addRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};

export const useUpdateRole = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.editRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};

export const useDeleteRole = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.removeRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};

export const useGetTeamUsers = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.settingsAccess.getTeamUsers.queryOptions());

    return {
        ...query,
        users: query.data ?? [],
    };
};

export const useCreateTeamUser = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.addTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};

export const useUpdateTeamUser = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.editTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};

export const useDeleteTeamUser = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.settingsAccess.removeTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }));
};
