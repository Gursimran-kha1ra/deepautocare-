# Components

The header, footer and floating action buttons are **rendered dynamically** from
`config.json` by `js/components.js` (see the `Components.header`, `Components.footer`
and `Components.fabs` builders). This keeps every page in sync automatically when
you edit the config — there is nothing to copy-paste across pages.

The files in this folder are **static reference snapshots** of that markup, useful if
you ever want to:

- understand the HTML structure the JS produces, or
- build a static fallback / server-rendered version.

They are **not** loaded by the site at runtime. Editing them has no effect on the
live pages — change `config.json` (data) or `js/components.js` (structure) instead.
