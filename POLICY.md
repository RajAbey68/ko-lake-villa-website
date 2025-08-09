# Architecture Policy — DO NOT CHANGE WITHOUT APPROVAL

This project is a **Next.js (App Router) + Tailwind** app. The architecture is **frozen**.
**Prohibited in PRs (without explicit approval):**
- Switching frameworks (e.g., Flask, Remix, Nuxt)
- Major Next.js version changes or edits to `next.config.*`
- Removing Tailwind or altering purge/safelist in a breaking way
- Deleting or moving `app/**` or `components/**` without plan/approval
- Dependency upgrades that change lockfile integrity without discussion

**To change protected areas**, your PR must include the label **architecture-approved**
or a commit message token **ARCH-APPROVED**.

Rationale: Prevent regressions, protect production, and keep velocity high.