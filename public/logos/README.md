# Brand logos

`src/components/Integrations.tsx` shows one tile per integration.

- WhatsApp, SAP and Google Sheets use the marks from the CC0 `simple-icons` package.
- For any other brand, drop its official SVG here named `<key>.svg` and the tile will use it
  automatically. Keys: `priority`, `hashavshevet`, `rivhit` (see `systems.tools` in `src/i18n/he.ts`).
  Until a file exists the tile shows a neutral monogram, never an imitation of the logo.

Use only files you are allowed to use: check each company's brand guidelines, or ask them.
