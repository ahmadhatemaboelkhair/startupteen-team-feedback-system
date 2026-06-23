# StartupTeen Team Feedback System

A production-ready Next.js application that replaces Google Forms with a branded StartupTeen tutor feedback workflow, Google Sheets storage, Google Drive uploads, and a secure Google-login admin dashboard.

## What Is Included

- Multi-step tutor feedback wizard
- Configurable schools dropdown
- Session-based dynamic deliverables checklist
- 1 to 10 evaluation sliders with live score summary
- Manual feedback or document upload
- Unique submission ID and success screen
- Google Apps Script backend for Sheets and Drive
- Google-authenticated admin dashboard
- Filters, analytics, CSV export, and Excel export
- Beginner deployment guide in [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## Local Setup

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env.local`.
3. Fill the environment variables after following the deployment guide.
4. Install dependencies:

```bash
npm install
```

5. Run the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Important Files

- `app/page.tsx`: tutor feedback form
- `app/admin/page.tsx`: admin dashboard
- `config/schools.ts`: editable schools list
- `config/checklists.ts`: editable session deliverables
- `scripts/Code.gs`: Google Apps Script backend
- `docs/DEPLOYMENT_GUIDE.md`: full beginner deployment instructions
