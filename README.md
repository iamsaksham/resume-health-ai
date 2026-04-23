# Resume Health AI

A Next.js app that ingests a resume file, extracts text on the server, and uses an OpenAI model (via LangChain) to turn that text into structured, validated JSON you can review and download.

## Features

- **Upload experience**: Drag-and-drop or “Browse files” on the home page. The UI accepts **PDF** up to **10 MB**, with optional in-browser **PDF preview** before analysis.
- **Text extraction**: Pdf text is extracted to be used in further stages.
- **Structured parsing**: Used **LangChain** agent using **gpt-4o-mini**, with output constrained to a **Zod** schema.
- **Results view**: After upload, you are taken to a layout that can show **document preview** (PDFs), **read-only extracted text**, and **structured sections** (basic info, skills with categorization UI, experience, education), plus a **Download JSON** action for the parsed object.
- **State**: Parsed data and preview metadata are held in **Redux** for the current session.

## Requirements

- **Node.js**: Use a current LTS release compatible with **Next.js 16** (for example **Node.js 20.x**). Older majors may not be supported.
- **npm** (or another client that respects `package-lock.json` if you use one).
- An **OpenAI API key** with access to models you configure in code (the app uses **`gpt-4o-mini`** for structured extraction).

## Environment variables

Create a file named **`.env.local`** in the **project root** (same folder as `package.json`). Next.js loads this automatically in development and production builds on your machine; the repo’s `.gitignore` ignores `.env*` so secrets are not committed.

Minimal example:

```bash
# Required for AI-powered resume → JSON (LangChain / OpenAI)
OPENAI_API_KEY=sk-...
```

Notes:

- **`OPENAI_API_KEY`** is what the LangChain client expects by default and is required for the main upload → JSON flow.


After changing env vars, **restart** the dev server (`npm run dev`) so Next.js picks them up.

## How to run

From the project root:

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in a browser, upload a resume, and use **Upload resume** to run extraction and structured parsing. When finished, you’ll land on **`/results`**.

Other scripts:

```bash
npm run build   # production build
npm run start   # run production server (after build)
npm run lint    # ESLint
```
