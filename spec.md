# OneStep Jobs

## Current State
No existing implementation. This is a fresh build migrating a Node.js/Express/SQLite app to the Caffeine (ICP/Motoko + React) platform.

## Requested Changes (Diff)

### Add
- Landing page with "OneStep Jobs" branding and "Apply for Jobs" CTA
- Candidate registration form: full name, phone, email, resume PDF upload
- Admin panel (protected, admin-only) showing all candidates with approve/reject actions
- Candidate status tracking: pending / approved / rejected
- Resume file storage and download/view link per candidate
- Role-based access: regular users register as candidates; admins manage applications

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with:
   - Candidate data model: id, name, phone, email, resumeBlobId, status
   - `registerCandidate(name, phone, email, resumeBlobId)` -- stores new candidate with status=pending
   - `getCandidates()` -- admin-only, returns all candidates
   - `approveCandidate(id)` -- admin-only, sets status=approved
   - `rejectCandidate(id)` -- admin-only, sets status=rejected
3. Build React frontend:
   - Landing page (index/home route): branding + "Apply for Jobs" button
   - Registration page: form with name, phone, email, resume upload (via blob-storage), submit calls registerCandidate
   - Admin page (protected route, admin only): table of candidates with name, phone, email, resume link, status badge, approve/reject buttons
   - Auth-gated admin route with login prompt
