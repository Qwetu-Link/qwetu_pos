"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useOfflineMutation } from "./useOfflineMutation";

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

    return useOfflineMutation(trpc.settingsAccess.addRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.addRole", label: "Create role" });
};

export const useUpdateRole = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(trpc.settingsAccess.editRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.editRole", label: "Update role" });
};

export const useDeleteRole = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(trpc.settingsAccess.removeRole.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.removeRole", label: "Delete role" });
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

    return useOfflineMutation(trpc.settingsAccess.addTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.addTeamUser", label: "Create team user" });
};

export const useUpdateTeamUser = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(trpc.settingsAccess.editTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.editTeamUser", label: "Update team user" });
};

export const useDeleteTeamUser = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(trpc.settingsAccess.removeTeamUser.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.settingsAccess.pathFilter());
        },
    }), { procedure: "settingsAccess.removeTeamUser", label: "Delete team user" });
};
