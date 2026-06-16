# Repository Guidelines

## Knowledge Base Purpose

This repository is a VuePress knowledge base, not an application codebase. Agent work should improve the structure, accuracy, and navigability of the notes under `docs/`. Prefer organizing reusable knowledge over producing one-off prose.

## Knowledge Placement Protocol

Before creating a page, search existing notes with `rg` to avoid duplicates. Extend an existing page when the topic already has a clear home; create a new page only when it represents a distinct concept, tool, pattern, case study, or reading note.

Place new content by domain:

- `docs/frontend/`, `docs/backend/`, `docs/devops/`, `docs/cloud/`, `docs/security/`: engineering topics.
- `docs/computer-science/`, `docs/algorithms/`, `docs/system-design/`, `docs/architecture/`: fundamentals and design knowledge.
- `docs/ai/`: AI, agents, RAG, prompting, model concepts, and related tools.
- `docs/reading/`: book notes and pattern summaries.
- `docs/projects/`: project-specific learning that should not be treated as general theory.

Use the nearest `README.md` as the section hub. If a new page should be discoverable, update the relevant README and, when needed, the matching file in `docs/.vuepress/sidebar/`.

## Page Shape & Naming

Follow existing Markdown frontmatter where present: `title`, `date`, `icon`, `category`, and `tag`. Keep titles concise and searchable. Use lowercase kebab-case filenames, with numeric prefixes for ordered lessons, for example `11-dns-basics.md`.

A good note states the concept, explains why it matters, gives examples, and links to related notes. Prefer short sections and concrete comparisons over long unstructured summaries.

## Linking & Knowledge Graph

Internal links should use relative Markdown links that VuePress can resolve. When adding or moving content, check nearby pages for references that should point to the new note. Do not leave orphan pages: every important page should be reachable from a README, sidebar entry, or related note.

## Maintenance Workflow

For content updates, preserve the existing Chinese technical writing style unless the surrounding section is already English. For config or navigation changes, edit `docs/.vuepress/config.ts`, `theme.ts`, `navbar.ts`, or `sidebar/` deliberately and avoid generated folders such as `.cache`, `.temp`, and `dist`.

Validate with `pnpm run build` before finishing substantial changes. Use `pnpm run dev` or `pnpm run clean-dev` when checking navigation, layout, or sidebar behavior locally.
