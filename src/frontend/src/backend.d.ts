import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Candidate {
    id: bigint;
    status: string;
    name: string;
    email: string;
    resumeBlobId: string;
    phone: string;
}
export interface Job {
    title: string;
    jobType: string;
    description: string;
    category: string;
    location: string;
}
export interface FetchJobsByCategoryParams {
    jobType?: string;
    category?: string;
    location?: string;
}
export interface JobCategory {
    icon: string;
    jobs: Array<Job>;
    name: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveCandidate(candidateId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    fetchJobsByCategory(params: FetchJobsByCategoryParams): Promise<Array<Job>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidates(): Promise<Array<Candidate>>;
    getJobCategories(): Promise<Array<JobCategory>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerCandidate(name: string, phone: string, email: string, resumeBlobId: string): Promise<bigint>;
    rejectCandidate(candidateId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPendingCandidate(candidateId: bigint): Promise<void>;
}
