# Architecture Policy (Do Not Change Without Approval)

This project is a **Next.js (App Router) + Tailwind** app. The architecture is **frozen**. PRs must **NOT**:
- change framework (no Flask/Remix/Nuxt migrations),
- change major Next.js version or `next.config.*`,
- replace Tailwind or purge critical safelists,
- delete core directories (`app/**`, `components/**`) unless explicitly approved.

To change any protected file, the PR **must** include label **architecture-approved** or a commit message token **ARCH-APPROVED**.

This is to keep production stable and avoid regressions. Feature work and bug fixes are welcome!