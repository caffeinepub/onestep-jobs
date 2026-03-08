import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Candidate {
    id: bigint;
    status: string;
    name: string;
    email: string;
    resumeBlobId: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveCandidate(candidateId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidates(): Promise<Array<Candidate>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerCandidate(name: string, phone: string, email: string, resumeBlobId: string): Promise<bigint>;
    rejectCandidate(candidateId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
