# Treetino landing page prompt

Copy the prompt below into an AI coding agent when asking it to create or redesign a public Treetino landing page.

```text
Create a production-ready, standalone landing page that looks native to the existing Treetino website. Work within the repository's current Laravel + Inertia + Vue 3 + TypeScript + Tailwind CSS v4 architecture. Before coding, inspect `resources/css/app.css`, representative public pages, and representative sections under `resources/js/custom/home/`. Use them as visual references; do not introduce a separate design system.

Follow these visual rules.

1. Page shell and container
   - The page must render independently. Do not import or depend on `DefaultLayout`; it will not be available to the page.
   - Implement the complete page shell required by the brief—including any header, navigation, main content, footer, or page-level effects—within the standalone page or components created specifically for it.
   - Use this exact standard content container unless a deliberately narrower reading width is needed:
     `relative mx-auto w-full max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]`
   - The desktop container therefore keeps roughly 100px gutters at `lg`, 200px gutters at `xl`, and never grows beyond 1400px. On mobile it is full width with 24px horizontal padding; at `sm` and above the fixed/responsive width supplies the gutter.
   - Preserve the Treetino vertical guide motif where it suits the section: add an absolute, pointer-events-none container-sized layer with subtle left/right borders, hidden below `sm`:
     `pointer-events-none absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-x border-black/20 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-white/20`
     A mask such as `[mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)]` may be used to fade the guides. Keep actual content in a separate `relative` container.
   - Typical section spacing is `py-20`, `pt-20`, or `pb-20`. Use `gap-6` for most grids/cards and `gap-12` when separating major content groups.
   - Full-bleed hero and CTA backgrounds may span the viewport, but their content must align to the standard container. A focused CTA may use `max-w-[1200px]` while retaining the same responsive width formula.

2. Typography
   - Use the global sans stack via Tailwind's normal inherited typography/`font-sans`; never add a page-specific webfont. `resources/css/app.css` is the source of truth for font configuration (currently DM Sans is registered in the theme, while the `body, html` utility layer declares the active `--font-sans` stack beginning with Instrument Sans).
   - Prefer clean, mostly regular-weight display type: major headings commonly use `text-4xl` through `text-6xl`, with responsive sizing and deliberately tight line height where needed. Card headings use `text-2xl`, `text-3xl`, or `text-4xl`.
   - Eyebrows/section labels use `text-xs font-semibold tracking-[0.2em] uppercase` with a subdued color such as `text-black/60` or `text-white/60`.
   - Body copy is concise, with comfortable line height and softened emphasis through opacity (`text-black/70`, `text-white/70`, or `opacity-70`) rather than extra colors.

3. Color system
   - Use semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-muted-foreground`, `border-border`) for general UI and dark-mode compatibility.
   - Use the Treetino brand utilities defined in `resources/css/app.css`: `t-accent` = rgb(39, 98, 173), `t-blue` = rgb(24, 61, 137), `t-dark` = rgb(33, 41, 85), and `t-purple` = rgb(42, 41, 58).
   - `t-blue` is the primary brand/action color. Use `t-dark` or a `from-t-blue to-t-dark` gradient for deep hero/CTA surfaces. White and near-black remain the main neutral surfaces/text.
   - Prefer restrained translucent layers such as `bg-white/10`, `bg-black/5`, and `bg-primary/5`. Do not invent new brand colors or scatter raw hex values through the page. A functional accent (for example green for energy status) is acceptable only when its meaning is clear.
   - Include appropriate `dark:` variants whenever the section is not intentionally locked to a photographic or branded color treatment.

4. Radius, borders, and elevation
   - `rounded-2xl` is the default radius for cards, panels, media frames, header surfaces, and major content blocks.
   - `rounded-xl` is the default for buttons, inputs, icon tiles, and compact controls.
   - Use `rounded-full` only for pills, segmented controls, badges, and circular decorative elements. Larger immersive/glass cards may use `rounded-3xl` sparingly.
   - Cards typically use a one-pixel `border` plus `shadow-xl`; media frames may use `overflow-hidden rounded-2xl border`. Light surfaces can use the semantic default border. On imagery/dark glass use `border-white/15`, `border-white/20`, or `border-white/30`; on light translucent surfaces use `border-black/10` or `border-black/20`.
   - Glass surfaces should combine a subtle transparent background, a low-opacity border, and blur (`backdrop-blur-xl`, `backdrop-blur-2xl`, or `backdrop-blur-3xl`). Keep glass legible and use it selectively, not on every block.
   - Avoid sharp rectangles, heavy opaque outlines, excessive gradients, and many competing shadow styles.

5. Components and composition
   - The standard primary action is `rounded-xl bg-t-blue px-5 py-3 text-white`. Keep CTA styling consistent throughout the standalone page instead of restyling every instance independently.
   - Existing Treetino components and sections are references, not required dependencies. Reproduce the relevant visual patterns locally when importing a shared component would prevent the page from standing alone.
   - Favor editorial layouts: large photography/product renders, asymmetric but aligned grids, generous whitespace, short copy, and one clear primary action per section.
   - Feature icons normally sit in a 48px tile: `flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue text-white`, with simple 24px line icons around `stroke-width="1.5"`.
   - Cards generally use `p-6`. Inputs use `rounded-xl border bg-white px-4 py-3 text-black` and must retain accessible labels, focus states, and validation behavior.
   - Use responsive aspect ratios and `object-cover` for imagery. Put gradient overlays over busy photos when text sits on top.
   - Motion should be subtle: opacity, small scale, spacing, or transform changes with approximately 300–600ms transitions. Respect existing animation utilities/composables and reduced-motion behavior.

6. Implementation quality
   - Build mobile-first and verify mobile, tablet, desktop, and wide-desktop layouts. Do not allow the standard container, cards, headings, or controls to overflow.
   - Use semantic HTML, logical heading order, keyboard-accessible controls, visible focus states, meaningful alt text, and adequate contrast.
   - Keep user-facing strings in the existing localization system rather than hard-coding one language, unless the task explicitly calls for static copy.
   - Keep the Vue component focused; extract repeated or substantial sections into `resources/js/custom/` following existing naming conventions.
   - Do not modify global tokens merely to make one page work. If the requested design exposes a genuine missing token or reusable primitive, explain it before adding it.
   - Avoid generic SaaS visual clichés that are not present in Treetino: rainbow gradients, tiny floating badges everywhere, excessive pill UI, dense dashboard cards, mismatched radii, and arbitrary max-width containers.

Before finishing, compare the result against the current Home, Contact, Collaboration, and product pages. Confirm that container widths, horizontal alignment, 24px card padding, 16px/12px radius hierarchy, subtle one-pixel borders, typography, brand colors, and responsive behavior all match. Confirm that the page renders without `DefaultLayout`. Run the repository's relevant formatter, type checks, and tests, and report any checks that could not be run.

Page-specific brief:
[Insert the page purpose, audience, required sections, copy, assets, routes/actions, and acceptance criteria here.]
```

## Source-of-truth note

This prompt intentionally tells agents to inspect the live components before implementation. The repeated Tailwind classes in the public pages currently define several conventions—especially the responsive container—more precisely than a centralized component or token does. If those conventions are later extracted into shared utilities, update this prompt to reference those utilities instead of duplicating their class lists.
