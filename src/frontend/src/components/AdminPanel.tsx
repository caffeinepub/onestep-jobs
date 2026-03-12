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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  LogIn,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Candidate } from "../backend.d";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApproveCandidate,
  useGetCandidates,
  useIsCallerAdmin,
  useRejectCandidate,
  useSetPendingCandidate,
} from "../hooks/useQueries";

type FilterTab = "all" | "pending" | "approved" | "rejected";

function toIndianWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[\s\-().+]/g, "");
  const match = digits.match(/(?:91)?([6-9]\d{9})$/);
  return match ? `91${match[1]}` : `91${digits.slice(-10)}`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <Badge
        className="gap-1.5 font-medium"
        style={{
          backgroundColor: "oklch(var(--status-approved-bg))",
          color: "oklch(var(--status-approved))",
          border: "1px solid oklch(var(--status-approved) / 0.3)",
          boxShadow: "0 0 8px oklch(var(--status-approved) / 0.25)",
        }}
      >
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge
        className="gap-1.5 font-medium"
        style={{
          backgroundColor: "oklch(var(--status-rejected-bg))",
          color: "oklch(var(--status-rejected))",
          border: "1px solid oklch(var(--status-rejected) / 0.3)",
          boxShadow: "0 0 8px oklch(var(--status-rejected) / 0.25)",
        }}
      >
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge
      className="gap-1.5 font-medium"
      style={{
        backgroundColor: "oklch(var(--status-pending-bg))",
        color: "oklch(var(--status-pending))",
        border: "1px solid oklch(var(--status-pending) / 0.3)",
        boxShadow: "0 0 8px oklch(var(--status-pending) / 0.25)",
      }}
    >
      <Clock className="w-3 h-3" />
      Pending
    </Badge>
  );
}

function ResumeCells({ blobId }: { blobId: string }) {
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

  const handleDownload = useCallback(() => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${blobId.slice(0, 8)}.pdf`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [url, blobId]);

  if (loading) return <Skeleton className="h-5 w-32" />;
  if (!url) return <span className="text-muted-foreground text-sm">—</span>;

  return (
    <div className="flex items-center gap-1.5">
      <a
        data-ocid="admin.candidate.open_pdf"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 px-2 hover:bg-primary/20 hover:border-primary/50 hover:text-primary"
        >
          <ExternalLink className="w-3 h-3" />
          Open PDF
        </Button>
      </a>
      <Button
        data-ocid="admin.candidate.download_button"
        size="sm"
        variant="outline"
        onClick={handleDownload}
        className="h-7 text-xs gap-1 px-2 hover:bg-accent/20 hover:border-accent/50 hover:text-accent-foreground"
      >
        <Download className="w-3 h-3" />
        Download
      </Button>
    </div>
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
  const pendingMutation = useSetPendingCandidate();
  const isActing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    pendingMutation.isPending;
  const ocidIndex = index + 1;

  return (
    <TableRow
      data-ocid={`admin.row.${ocidIndex}`}
      className="hover:bg-muted/30 transition-colors"
    >
      <TableCell className="font-semibold text-foreground py-4">
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
          <ResumeCells blobId={candidate.resumeBlobId} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={candidate.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            data-ocid={`admin.candidate.approve_button.${ocidIndex}`}
            size="sm"
            variant="outline"
            onClick={() => approveMutation.mutate(candidate.id)}
            disabled={isActing || candidate.status === "approved"}
            className="gap-1 text-xs h-7 px-2 hover:bg-[oklch(var(--status-approved-bg))] hover:text-[oklch(var(--status-approved))] hover:border-[oklch(var(--status-approved)/0.4)] disabled:opacity-40"
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
            className="gap-1 text-xs h-7 px-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 disabled:opacity-40"
          >
            {rejectMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            Reject
          </Button>
          <Button
            data-ocid={`admin.candidate.pending_button.${ocidIndex}`}
            size="sm"
            variant="outline"
            onClick={() => pendingMutation.mutate(candidate.id)}
            disabled={isActing || candidate.status === "pending"}
            className="gap-1 text-xs h-7 px-2 hover:bg-[oklch(var(--status-pending-bg))] hover:text-[oklch(var(--status-pending))] hover:border-[oklch(var(--status-pending)/0.4)] disabled:opacity-40"
          >
            {pendingMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            Pending
          </Button>
          {candidate.status === "approved" && candidate.phone && (
            <a
              data-ocid={`admin.candidate.whatsapp_button.${ocidIndex}`}
              href={`https://wa.me/${toIndianWhatsAppNumber(candidate.phone)}?text=${encodeURIComponent(
                `Hello ${candidate.name}, Congratulations! 🎉 Your job application has been approved by OneStep Jobs (onestepjobs.in). Our team will contact you soon with the next steps. Thank you for applying!`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs h-7 px-2 text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/10 hover:border-[#25D366]/70"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </Button>
            </a>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-3"
      style={{ borderColor: `${color}30` }}
    >
      <div
        className="w-2 h-10 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-2xl font-display font-black text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
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
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

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
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "oklch(var(--destructive) / 0.12)" }}
          >
            <ShieldAlert
              className="w-8 h-8"
              style={{ color: "oklch(var(--destructive))" }}
            />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Access Restricted
          </h2>
          <p className="text-muted-foreground text-sm">
            This page is only accessible to the site owner. Admin access is
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

  const allCandidates = candidates ?? [];
  const filtered =
    activeFilter === "all"
      ? allCandidates
      : allCandidates.filter((c) => c.status === activeFilter);

  const totalCount = allCandidates.length;
  const pendingCount = allCandidates.filter(
    (c) => c.status === "pending",
  ).length;
  const approvedCount = allCandidates.filter(
    (c) => c.status === "approved",
  ).length;
  const rejectedCount = allCandidates.filter(
    (c) => c.status === "rejected",
  ).length;

  return (
    <div>
      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total"
            value={totalCount}
            color="oklch(0.62 0.22 270)"
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            color="oklch(var(--status-pending))"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            color="oklch(var(--status-approved))"
          />
          <StatCard
            label="Rejected"
            value={rejectedCount}
            color="oklch(var(--status-rejected))"
          />
        </div>
      )}

      {/* Filter bar + refresh */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <Tabs
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as FilterTab)}
        >
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger data-ocid="admin.filter.tab" value="all">
              All ({totalCount})
            </TabsTrigger>
            <TabsTrigger data-ocid="admin.filter.tab" value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger data-ocid="admin.filter.tab" value="approved">
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger data-ocid="admin.filter.tab" value="rejected">
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
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

      {/* Error */}
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

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="admin.loading_state"
          className="border border-border rounded-xl overflow-hidden"
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
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-7 w-14" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div
          data-ocid="admin.empty_state"
          className="border-2 border-dashed border-border rounded-2xl py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            {activeFilter === "all"
              ? "No applications yet"
              : `No ${activeFilter} applications`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeFilter === "all"
              ? "Candidate applications will appear here once they register."
              : `No candidates have the status "${activeFilter}" yet.`}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && filtered.length > 0 && (
        <motion.div
          data-ocid="admin.candidates_list"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-border rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
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
                {filtered.map((candidate, index) => (
                  <CandidateRow
                    key={candidate.id.toString()}
                    candidate={candidate}
                    index={index}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
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
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "oklch(var(--status-approved))",
                  boxShadow: "0 0 8px oklch(var(--status-approved))",
                }}
              />
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "oklch(var(--status-approved))" }}
              >
                Owner Access
              </p>
            </div>
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
                className="gap-2 font-semibold cta-glow"
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
