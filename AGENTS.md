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

Let the subject determine the page structure. Concept notes may define and compare; how-to notes should record prerequisites, commands, expected results, and relevant failure cases; project notes should preserve context, decisions, and constraints. Do not force every page to contain an introduction, benefits, use cases, or a concluding summary.

## Writing Style

Write for future technical reference. Start with the concept, problem, constraint, or operation itself. Omit generic scene-setting and meta narration such as "在现代开发中", "本文将介绍", "接下来看看", and "首先，我们需要" unless they carry necessary information.

Use neutral, literal language for factual material. Prefer concrete subjects and verbs over promotional adjectives, rhetorical questions, motivational transitions, or claims such as "优秀", "强大", "显著提升", and "最佳实践" without supporting context. State relevant versions, prerequisites, scope, and exceptions where they affect correctness.

Do not manufacture a personal voice. First-person wording is appropriate only when recording an actual project decision, observation, unresolved question, or reading note. Otherwise describe the fact or trade-off directly.

Let headings describe their content. Avoid repetitive "什么是 X", "为什么需要 X", "优点", "缺点", "适用场景", and "总结" sections when the same information fits more naturally into a definition, comparison, constraint, or example.

Examples should clarify a specific claim. Explain non-obvious behavior, assumptions, and expected output, but do not restate code line by line or repeat the same conclusion before and after an example.

When editing existing notes, remove repetitive sentence patterns, exaggerated certainty, generic recommendations, emoji checklists, broad claims without context, and conclusions that only repeat earlier sections. Preserve quotations, intentional personal notes, and the surrounding author's style; do not rewrite unrelated passages merely for uniformity.

## Linking & Knowledge Graph

Internal links should use relative Markdown links that VuePress can resolve. When adding or moving content, check nearby pages for references that should point to the new note. Do not leave orphan pages: every important page should be reachable from a README, sidebar entry, or related note.

## Maintenance Workflow

For content updates, preserve the existing Chinese technical writing style unless the surrounding section is already English. For config or navigation changes, edit `docs/.vuepress/config.ts`, `theme.ts`, `navbar.ts`, or `sidebar/` deliberately and avoid generated folders such as `.cache`, `.temp`, and `dist`.

Validate with `pnpm run build` before finishing substantial changes. Use `pnpm run dev` or `pnpm run clean-dev` when checking navigation, layout, or sidebar behavior locally.
