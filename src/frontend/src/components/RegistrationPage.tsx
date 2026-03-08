import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useRegisterCandidate } from "../hooks/useQueries";

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  resume?: string;
}

function validate(data: FormData, file: File | null): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Full name is required";
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s+\-().]{7,20}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (!data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!file) errors.resume = "Please upload your resume";
  return errors;
}

export function RegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useRegisterCandidate();
  const { uploadFile, uploadProgress, isUploading } = useBlobStorage();

  const isLoading = isUploading || registerMutation.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Only PDF, DOC, and DOCX files are accepted",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be under 10 MB",
        }));
        return;
      }
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(formData, resumeFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      // Upload resume to blob storage first
      const resumeBlobId = await uploadFile(resumeFile!);

      // Register candidate
      await registerMutation.mutateAsync({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        resumeBlobId,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(
        error?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: "", phone: "", email: "" });
    setResumeFile(null);
    setErrors({});
    setSubmitError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero section */}
      <div className="relative bg-card border-b border-border grid-texture">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-vivid" />
              Now Accepting Applications
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground leading-none tracking-tight mb-4">
              Join Our Team
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Submit your application and our team will review it. We respond to
              all applications within 5–7 business days.
            </p>
          </motion.div>
        </div>
        {/* Decorative element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block dot-pattern opacity-40" />
      </div>

      {/* Form section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                data-ocid="register.success_state"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-2 border-accent/40 shadow-lg">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-accent-vivid" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                      Application Submitted!
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                      Thank you for applying. We&apos;ve received your
                      application and will be in touch shortly.
                    </p>
                    <Button onClick={handleReset} variant="outline" size="lg">
                      Submit Another Application
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-sm border-border">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-display text-2xl">
                      Application Form
                    </CardTitle>
                    <CardDescription>
                      All fields are required. We keep your information secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-foreground"
                        >
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            data-ocid="register.name_input"
                            type="text"
                            placeholder="e.g. Sarah Johnson"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                            disabled={isLoading}
                            autoComplete="name"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold text-foreground"
                        >
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            data-ocid="register.phone_input"
                            type="tel"
                            placeholder="e.g. +1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className={`pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                            disabled={isLoading}
                            autoComplete="tel"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-foreground"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            data-ocid="register.email_input"
                            type="email"
                            placeholder="e.g. sarah@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                            disabled={isLoading}
                            autoComplete="email"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Resume Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Resume
                        </Label>
                        {resumeFile ? (
                          <div className="flex items-center gap-3 p-4 rounded-lg border border-accent/40 bg-accent/10">
                            <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {resumeFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(resumeFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              disabled={isLoading}
                              className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                              aria-label="Remove file"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="resume-upload"
                            className={`flex flex-col items-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                              errors.resume
                                ? "border-destructive bg-destructive/5"
                                : "border-border hover:border-accent/60 hover:bg-accent/5"
                            } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-foreground">
                                <span
                                  data-ocid="register.resume_upload_button"
                                  className="text-accent-vivid underline underline-offset-2"
                                >
                                  Choose a file
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX up to 10 MB
                              </p>
                            </div>
                          </label>
                        )}
                        <input
                          ref={fileInputRef}
                          id="resume-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        {errors.resume && (
                          <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.resume}
                          </p>
                        )}
                      </div>

                      {/* Upload progress */}
                      <AnimatePresence>
                        {isUploading && (
                          <motion.div
                            data-ocid="register.loading_state"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Uploading resume…</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress
                              value={uploadProgress}
                              className="h-1.5"
                            />
                          </motion.div>
                        )}
                        {registerMutation.isPending && !isUploading && (
                          <motion.div
                            data-ocid="register.loading_state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting your application…
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit error */}
                      <AnimatePresence>
                        {submitError && (
                          <motion.div
                            data-ocid="register.error_state"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{submitError}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <Button
                        type="submit"
                        data-ocid="register.submit_button"
                        size="lg"
                        className="w-full font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isUploading ? "Uploading Resume…" : "Submitting…"}
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
