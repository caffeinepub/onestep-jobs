import { Footprints, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Footprints className="w-3 h-3 text-primary-foreground" />
          </div>
          <span>© {year} OneStep Jobs. All rights reserved.</span>
        </div>
        <a
          href={utmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          Built with{" "}
          <Heart className="w-3.5 h-3.5 text-accent-vivid fill-accent-vivid" />{" "}
          using caffeine.ai
        </a>
      </div>
    </footer>
  );
}
