import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Candidate } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCandidates() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCandidates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (candidateId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveCandidate(candidateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useRejectCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (candidateId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectCandidate(candidateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useRegisterCandidate() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      email: string;
      resumeBlobId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerCandidate(
        params.name,
        params.phone,
        params.email,
        params.resumeBlobId,
      );
    },
  });
}
