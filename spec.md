# OneStep Jobs — v4 Upgrade

## Current State
- Landing page with hero, open roles grid (static), how-it-works, and CTA
- Candidate registration form with PDF resume upload via blob-storage
- Admin panel (login-gated): lists candidates with approve/reject actions and WhatsApp notify
- Authorization via Internet Identity; isCallerAdmin checks admin role
- Blob storage for PDF resumes with URL retrieval

## Requested Changes (Diff)

### Add
- **3D animated hero scene** on landing page using React Three Fiber (floating orbs, particles, or abstract geometry tied to the OneStep Jobs brand)
- **Vivid design refresh**: bold OKLCH color palette, stronger typographic contrast, glowing accent animations
- **Job categories section**: categorized job listings (IT, Finance, Marketing, Healthcare, Engineering, Sales) with expandable category cards and job count badges
- **`setPendingCandidate(id)`** backend function to reset a candidate back to pending status
- **Pending action button** in admin panel alongside approve/reject
- **PDF open + download buttons** in admin panel: separate "Open" (new tab) and "Download" (force download) controls for each resume
- **`isCallerOwner()`** backend function — returns true only for the canister deployer/owner principal
- Admin panel access guard uses `isCallerOwner()` instead of `isCallerAdmin()` so only the owner can enter

### Modify
- Admin panel `ResumeLink` component → replaced with two buttons: Open PDF and Download PDF
- Admin candidate row: add "Set Pending" button alongside Approve/Reject
- Admin access check: swap `isCallerAdmin` guard for `isCallerOwner`
- Landing page hero: embed 3D canvas behind copy
- Open Roles section: transform from 4-card grid to category-wise expandable list with job counts
- `index.css` and `tailwind.config.js`: vivid OKLCH palette, 3D-friendly dark backgrounds, Bricolage Grotesque display font

### Remove
- Static 4-role grid on landing page (replaced by category-wise job list)

## Implementation Plan
1. Generate new Motoko backend with `setPendingCandidate`, `isCallerOwner`, and `getJobCategories`
2. Install React Three Fiber and drei for 3D canvas
3. Redesign `index.css` with dark-first vivid OKLCH tokens
4. Build `HeroScene` component (Three.js floating spheres / particle field)
5. Build `JobCategoriesSection` with category cards and job listings
6. Update `AdminPanel`: add PDF open/download buttons, Set Pending action
7. Update `LandingPage` to embed 3D hero and category section
8. Wire `isCallerOwner` query in hooks and admin access guard
