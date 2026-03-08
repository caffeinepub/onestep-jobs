import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileDown,
  Loader2,
  LogIn,
  RefreshCw,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Candidate } from "../backend.d";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApproveCandidate,
  useGetCandidates,
  useIsCallerAdmin,
  useRejectCandidate,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <Badge className="gap-1.5 bg-[oklch(var(--status-approved-bg))] text-[oklch(var(--status-approved))] border-[oklch(var(--status-approved)/0.3)] hover:bg-[oklch(var(--status-approved-bg))] font-medium">
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="gap-1.5 bg-[oklch(var(--status-rejected-bg))] text-[oklch(var(--status-rejected))] border-[oklch(var(--status-rejected)/0.3)] hover:bg-[oklch(var(--status-rejected-bg))] font-medium">
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="gap-1.5 bg-[oklch(var(--status-pending-bg))] text-[oklch(var(--status-pending))] border-[oklch(var(--status-pending)/0.3)] hover:bg-[oklch(var(--status-pending-bg))] font-medium">
      <Clock className="w-3 h-3" />
      Pending
    </Badge>
  );
}

function ResumeLink({ blobId }: { blobId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getFileUrl } = useBlobStorage();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFileUrl(blobId)
      .then((u) => {
        if (!cancelled) {
          setUrl(u);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [blobId, getFileUrl]);

  if (loading) return <Skeleton className="h-5 w-24" />;
  if (!url) return <span className="text-muted-foreground text-sm">—</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-accent-vivid hover:underline font-medium"
    >
      <FileDown className="w-3.5 h-3.5" />
      View Resume
    </a>
  );
}

function CandidateRow({
  candidate,
  index,
}: {
  candidate: Candidate;
  index: number;
}) {
  const approveMutation = useApproveCandidate();
  const rejectMutation = useRejectCandidate();
  const isActing = approveMutation.isPending || rejectMutation.isPending;

  const ocidIndex = index + 1;

  return (
    <TableRow
      data-ocid={`admin.row.${ocidIndex}`}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell className="font-medium text-foreground py-4">
        {candidate.name}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {candidate.phone}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {candidate.email}
      </TableCell>
      <TableCell>
        {candidate.resumeBlobId ? (
          <ResumeLink blobId={candidate.resumeBlobId} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={candidate.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            data-ocid={`admin.candidate.approve_button.${ocidIndex}`}
            size="sm"
            variant="outline"
            onClick={() => approveMutation.mutate(candidate.id)}
            disabled={isActing || candidate.status === "approved"}
            className="gap-1.5 text-xs font-medium hover:bg-accent/20 hover:text-accent-foreground hover:border-accent/60 disabled:opacity-40"
          >
            {approveMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3 h-3" />
            )}
            Approve
          </Button>
          <Button
            data-ocid={`admin.candidate.reject_button.${ocidIndex}`}
            size="sm"
            variant="outline"
            onClick={() => rejectMutation.mutate(candidate.id)}
            disabled={isActing || candidate.status === "rejected"}
            className="gap-1.5 text-xs font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 disabled:opacity-40"
          >
            {rejectMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            Reject
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function AdminContent() {
  const queryClient = useQueryClient();
  const {
    data: candidates,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCandidates();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  if (isAdminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex items-center justify-center py-24"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            You don&apos;t have permission to view this page. Admin access is
            required.
          </p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["candidates"] });
    void refetch();
  };

  return (
    <div>
      {/* Admin header bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            All Applications
          </h2>
          {candidates && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {candidates.length} candidate
              {candidates.length !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        <Button
          data-ocid="admin.refresh_button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      <AnimatePresence>
        {isError && (
          <motion.div
            data-ocid="admin.error_state"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load candidates. Please try refreshing.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          data-ocid="admin.loading_state"
          className="border border-border rounded-lg overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && candidates?.length === 0 && (
        <div
          data-ocid="admin.empty_state"
          className="border-2 border-dashed border-border rounded-xl py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            No applications yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Candidate applications will appear here once they register.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && candidates && candidates.length > 0 && (
        <motion.div
          data-ocid="admin.candidates_list"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-border rounded-lg overflow-hidden shadow-xs"
        >
          <Table data-ocid="admin.candidates_table">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Resume
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate, index) => (
                <CandidateRow
                  key={candidate.id.toString()}
                  candidate={candidate}
                  index={index}
                />
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}

export function AdminPanel() {
  const { identity, login, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div>
      {/* Page header */}
      <div className="relative bg-card border-b border-border grid-texture">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Review and manage candidate applications.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Authentication Required
              </h2>
              <p className="text-muted-foreground text-sm mb-7 text-center max-w-xs">
                Sign in with your credentials to access the admin panel.
              </p>
              <Button
                data-ocid="admin.login_button"
                size="lg"
                onClick={login}
                disabled={isLoggingIn || loginStatus === "initializing"}
                className="gap-2 font-semibold"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoggingIn ? "Signing in…" : "Sign In to Continue"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
