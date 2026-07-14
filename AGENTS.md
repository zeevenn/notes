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

Default technical notes to neutral, third-person documentation. A personal knowledge base describes how knowledge is selected and organized; it does not imply first-person narration. Use first-person wording only for an actual project decision, observation, unresolved question, or reading note. Otherwise describe the fact or trade-off directly.

For introductory and foundational notes, assume the reader understands the surrounding domain but does not yet know the topic's jargon. Establish the concrete problem and the smallest complete flow before introducing internal formats, implementation variants, edge cases, or security hardening. Prefer this progression when it fits the topic: problem and context, minimal example or end-to-end flow, vocabulary and mechanism, practical implementation, then advanced and reference material. Do not open with a dense taxonomy, a standards quotation, or an exhaustive list of adjacent concepts.

Define every acronym and specialized term in plain Chinese at its first meaningful use, including the role it plays in the current example or flow. Do not introduce a term merely for completeness. If several advanced terms are only needed later, move them into a clearly named advanced or reference section, or link to a separate note. Tables and checklists may summarize concepts after they have been explained; they must not replace the explanation or introduce many unknown terms at once.

Keep the main learning path distinct from implementation details and reference material. A note does not become complete by collecting every related concept on one page. When a topic spans frontend and backend, organize the explanation around an end-to-end request or state transition, then describe each side at the point where it participates. Use a Mermaid sequence diagram when interactions across components are easier to understand as a timeline, and explain the participants and outcome in the surrounding text.

Before drafting or substantially rewriting a foundational concept note, review at least two reputable introductory explanations for teaching order and examples, and verify technical claims against primary standards, official documentation, or current security guidance. Borrow the progression, not unsupported claims or outdated recommendations. When tutorial advice conflicts with primary or current security sources, keep the clearer explanation but follow the primary source for the technical conclusion.

Let headings describe their content. Avoid repetitive "什么是 X", "为什么需要 X", "优点", "缺点", "适用场景", and "总结" sections when the same information fits more naturally into a definition, comparison, constraint, or example.

Examples should clarify a specific claim. Explain non-obvious behavior, assumptions, and expected output, but do not restate code line by line or repeat the same conclusion before and after an example.

When editing existing notes, remove repetitive sentence patterns, exaggerated certainty, generic recommendations, emoji checklists, broad claims without context, and conclusions that only repeat earlier sections. Preserve quotations, intentional personal notes, and the surrounding author's style; do not rewrite unrelated passages merely for uniformity.

## Linking & Knowledge Graph

Internal links should use relative Markdown links that VuePress can resolve. When adding or moving content, check nearby pages for references that should point to the new note. Do not leave orphan pages: every important page should be reachable from a README, sidebar entry, or related note.

## Maintenance Workflow

For content updates, preserve the existing Chinese technical writing style unless the surrounding section is already English. For config or navigation changes, edit `docs/.vuepress/config.ts`, `theme.ts`, `navbar.ts`, or `sidebar/` deliberately and avoid generated folders such as `.cache`, `.temp`, and `dist`.

Validate with `pnpm run build` before finishing substantial changes. Use `pnpm run dev` or `pnpm run clean-dev` when checking navigation, layout, or sidebar behavior locally.
