# StartupTeen Team Feedback System Deployment Guide

This guide assumes you have never deployed a Next.js app or connected a website to Google Sheets before.

## 1. Create Or Prepare The Google Sheet

The Apps Script can create the Sheet automatically, but beginners usually find it easier to know where everything lives.

1. Go to [Google Sheets](https://sheets.google.com).
2. Click **Blank spreadsheet**.
3. Rename it to `StartupTeen Team Feedback Responses`.
4. Copy the spreadsheet ID from the URL.

Example URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit
```

Keep this Sheet open. The Apps Script will create the `Submissions` tab and all required columns.

## 2. Create The Google Apps Script Project

1. Open [Google Apps Script](https://script.google.com).
2. Click **New project**.
3. Rename the project to `StartupTeen Feedback Backend`.
4. Delete the default code in `Code.gs`.
5. Open this project file:

```text
scripts/Code.gs
```

6. Copy all code from `scripts/Code.gs`.
7. Paste it into Google Apps Script.
8. Click **Save**.

## 3. Configure Apps Script Properties

1. In Apps Script, click **Project Settings** in the left sidebar.
2. Scroll to **Script Properties**.
3. Click **Add script property**.
4. Add this property:

```text
Property: API_TOKEN
Value: choose-a-long-random-secret
```

Use a strong secret. You will paste the same value into Vercel later as `GOOGLE_APPS_SCRIPT_TOKEN`.

If you already created a Sheet manually, add this property too:

```text
Property: SPREADSHEET_ID
Value: your Google Sheet ID
```

If you skip `SPREADSHEET_ID`, the Apps Script will automatically create a new spreadsheet the first time setup or submission runs.

## 4. Create The Google Drive Upload Folder

The Apps Script can also create this automatically.

Recommended beginner path:

1. In Apps Script, select the function dropdown near the top.
2. Choose `setupFeedbackSystem`.
3. Click **Run**.
4. Google will ask for permissions.
5. Choose your Google account.
6. Click **Advanced** if Google shows a warning.
7. Click **Go to StartupTeen Feedback Backend**.
8. Allow permissions for Sheets and Drive.
9. After it runs, open **Executions** in the left sidebar.
10. Check that the function completed successfully.

This creates:

- Google Sheet tab named `Submissions`
- Google Drive folder named `StartupTeen Feedback Uploads`

Uploaded PDF, DOCX, DOC, and image files will be stored in that folder. The file URL is saved into the Sheet.

By default, uploaded files are private to the Google account that owns the Apps Script. To allow anyone with the file link to view uploads, edit this line in `scripts/Code.gs` before deployment:

```js
fileSharing: "ANYONE_WITH_LINK"
```

Only use public link sharing if your organization approves it.

## 5. Deploy The Apps Script Web App

1. In Apps Script, click **Deploy**.
2. Click **New deployment**.
3. Click the gear icon beside **Select type**.
4. Choose **Web app**.
5. Description: `Production web app`.
6. Execute as: **Me**.
7. Who has access: **Anyone**.
8. Click **Deploy**.
9. Approve permissions if asked.
10. Copy the **Web app URL**.

The URL looks like this:

```text
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
```

You will use it as `GOOGLE_APPS_SCRIPT_URL`.

## 6. Create Google Login For Admins

The admin dashboard uses Google Login through NextAuth.

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project, for example `StartupTeen Feedback`.
3. Open **APIs & Services**.
4. Open **OAuth consent screen**.
5. Choose **External** or **Internal** depending on your Google Workspace.
6. Fill the app name: `StartupTeen Team Feedback System`.
7. Add your support email.
8. Save and continue until the consent screen is created.
9. Open **Clients** in the left sidebar.
10. Click **Create OAuth client**.
11. Application type: **Web application**.
12. Name: `StartupTeen Feedback Web`.
13. Add this authorized JavaScript origin for local testing:

```text
http://localhost:3000
```

14. Add this authorized redirect URI for local testing:

```text
http://localhost:3000/api/auth/callback/google
```

15. After deploying to Vercel, return here and add the Vercel versions:

```text
https://your-vercel-domain.vercel.app
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

16. Click **Create**.
17. Copy the **Client ID** and **Client Secret**.

## 7. Configure Local Environment Variables

1. In the project folder, copy `.env.example`.
2. Rename the copy to `.env.local`.
3. Fill it like this:

```text
NEXT_PUBLIC_APP_NAME="StartupTeen Team Feedback System"
GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
GOOGLE_APPS_SCRIPT_TOKEN="the-same-secret-from-API_TOKEN"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ADMIN_EMAILS="admin1@example.com,admin2@example.com"
```

To generate `NEXTAUTH_SECRET`, run one of these:

```bash
openssl rand -base64 32
```

or use a password generator and create a long random value.

Only emails listed in `ADMIN_EMAILS` can open `/admin`.

## 8. Run And Test Locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

4. Submit a test response.
5. Use a Tutor ID that starts with `T-` followed by numbers, like:

```text
T-1080
```

6. Use a Group ID like:

```text
G-1234
```

7. Try uploading a small PDF or image.
8. After submission, confirm that the success page shows:

```text
Feedback Submitted Successfully
```

9. Open the Google Sheet and confirm a new row was added.
10. Open the Drive folder and confirm the uploaded file exists.
11. Open:

```text
http://localhost:3000/admin
```

12. Sign in with an email listed in `ADMIN_EMAILS`.
13. Confirm that submissions appear in the dashboard.
14. Test filters, CSV export, Excel export, and uploaded file links.

## 9. Host The App On Vercel

Vercel hosts the Next.js website. The easiest beginner path is:

```text
Your computer project -> GitHub -> Vercel
```

### 9.1 Create A GitHub Account

1. Go to [GitHub](https://github.com).
2. Create an account or sign in.
3. Keep GitHub open.

### 9.2 Create A New GitHub Repository

1. In GitHub, click the **+** icon in the top-right.
2. Click **New repository**.
3. Repository name:

```text
startupteen-team-feedback-system
```

4. Visibility: choose **Private** or **Public**.
5. Do not add README, `.gitignore`, or license because this project already has files.
6. Click **Create repository**.

### 9.3 Upload The Project To GitHub

Recommended method if you use GitHub Desktop:

1. Install [GitHub Desktop](https://desktop.github.com).
2. Open GitHub Desktop.
3. Sign in to your GitHub account.
4. Click **File**.
5. Click **Add local repository**.
6. Choose this project folder:

```text
E:\ISchool\Ischool career\B2B\StartupTeen Evaluation
```

7. If GitHub Desktop says it is not a Git repository, click **create a repository**.
8. Commit message:

```text
Initial StartupTeen feedback app
```

9. Click **Commit to main**.
10. Click **Publish repository**.
11. Choose the GitHub repository you created.
12. Make sure **Keep this code private** is checked if you want it private.
13. Click **Publish repository**.

Alternative method if you use terminal:

```bash
git init
git add .
git commit -m "Initial StartupTeen feedback app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/startupteen-team-feedback-system.git
git push -u origin main
```

Important: do not upload `.env.local`. It contains secrets and is already ignored by `.gitignore`.

### 9.4 Create A Vercel Account

1. Go to [Vercel](https://vercel.com).
2. Click **Sign Up** or **Log In**.
3. Choose **Continue with GitHub**.
4. Allow Vercel to connect to GitHub.

### 9.5 Import The Project Into Vercel

1. In Vercel, click **Add New**.
2. Click **Project**.
3. Find `startupteen-team-feedback-system`.
4. Click **Import**.
5. If Vercel asks for GitHub permissions, click **Configure GitHub App** and allow access to this repository.
6. Framework Preset should show:

```text
Next.js
```

7. Root Directory should stay as:

```text
./
```

8. Build Command can stay default:

```text
next build
```

9. Install Command can stay default. If Vercel detects pnpm, it will use:

```text
pnpm install
```

### 9.6 Add Environment Variables In Vercel

Before clicking Deploy, open the **Environment Variables** section.

Add these one by one:

```text
NEXT_PUBLIC_APP_NAME
StartupTeen Team Feedback System
```

```text
GOOGLE_APPS_SCRIPT_URL
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

```text
GOOGLE_APPS_SCRIPT_TOKEN
the-same-secret-from-Apps-Script-API_TOKEN
```

```text
NEXTAUTH_URL
https://your-vercel-domain.vercel.app
```

You do not know the final Vercel domain yet before the first deploy. For the first deploy, use the temporary project URL Vercel shows if available. If you do not see it yet, deploy once, copy the Vercel URL, then come back and update `NEXTAUTH_URL`.

```text
NEXTAUTH_SECRET
your-long-random-secret
```

```text
GOOGLE_CLIENT_ID
your-google-oauth-client-id
```

```text
GOOGLE_CLIENT_SECRET
your-google-oauth-client-secret
```

```text
ADMIN_EMAILS
admin1@example.com,admin2@example.com
```

For each variable:

1. Type the name in **Key**.
2. Type the value in **Value**.
3. Select all environments: **Production**, **Preview**, and **Development**.
4. Click **Add**.

### 9.7 Deploy The Website

1. Click **Deploy**.
2. Wait for Vercel to install dependencies and build the app.
3. If the build succeeds, Vercel will show **Congratulations**.
4. Click **Continue to Dashboard**.
5. Copy the production URL. It looks like:

```text
https://startupteen-team-feedback-system.vercel.app
```

### 9.8 Update NEXTAUTH_URL After First Deploy

1. In Vercel, open your project.
2. Click **Settings**.
3. Click **Environment Variables**.
4. Find `NEXTAUTH_URL`.
5. Set it to your exact Vercel URL:

```text
https://startupteen-team-feedback-system.vercel.app
```

6. Save the change.
7. Go to the **Deployments** tab.
8. Click the three dots beside the latest deployment.
9. Click **Redeploy**.
10. Choose **Use existing Build Cache**.
11. Click **Redeploy**.

### 9.9 If Vercel Build Fails

Open the failed deployment logs and check the message.

Common fixes:

- Missing environment variable: add it in **Settings > Environment Variables**.
- Wrong Apps Script URL: make sure it ends with `/exec`.
- Google login not working: finish Section 10 and add the Vercel callback URL to Google Cloud.
- Repository did not upload correctly: confirm `package.json`, `app`, `components`, `config`, `lib`, `scripts`, and `docs` exist on GitHub.

## 10. Finish Google Login Setup For Vercel

After Vercel gives you the production URL:

1. Go back to [Google Cloud Console](https://console.cloud.google.com).
2. Open **APIs & Services**.
3. Open **Clients**.
4. Click your OAuth client.
5. Add this authorized JavaScript origin:

```text
https://your-vercel-domain.vercel.app
```

6. Add this authorized redirect URI:

```text
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

7. Save.

## 11. Test Production Submissions

1. Open your Vercel URL.
2. Complete the feedback form.
3. Submit.
4. Confirm the success page shows a unique submission ID.
5. Open the Google Sheet.
6. Confirm the row was added.
7. Upload a test file.
8. Confirm the Google Drive file URL appears in the Sheet.
9. Open `/admin` on the Vercel URL.
10. Sign in with an approved admin Google account.
11. Confirm analytics and submissions load.

## 12. Add Schools To The Dropdown

Schools are configured in:

```text
config/schools.ts
```

Example:

```ts
export const schools = [
  "iSchool Maadi",
  "iSchool Nasr City",
  "New School Name"
];
```

After editing:

1. Save the file.
2. Commit the change.
3. Push to GitHub.
4. Vercel will redeploy automatically.

No Apps Script change is needed for school updates.

## 13. Update Session Checklists Later

Session deliverables are configured in:

```text
config/checklists.ts
```

Example:

```ts
export const sessionChecklists = {
  "Session 1": ["Problem Statement", "New Deliverable"]
};
```

Important: the Google Sheet columns are generated from `ALL_CHECKLIST_ITEMS` inside:

```text
scripts/Code.gs
```

If you add a new checklist item in `config/checklists.ts`, also add the exact same item text to `ALL_CHECKLIST_ITEMS` in `scripts/Code.gs`.

Then:

1. Paste the updated Apps Script code into Google Apps Script.
2. Save.
3. Click **Deploy**.
4. Choose **Manage deployments**.
5. Edit the active web app deployment.
6. Select **New version**.
7. Click **Deploy**.
8. Push the website change to GitHub.
9. Vercel redeploys the website.

New columns will be added when `setupFeedbackSystem` or the next submission runs.

## 14. Required Google Sheet Columns

The Apps Script creates these automatically:

- Timestamp
- Submission ID
- Tutor ID
- Tutor Name
- School
- Group ID
- Team Name
- Members Count
- Session Date
- Session Number
- Every checklist item with `Completed` and `Notes` columns
- Presentation Score
- Idea Score
- Technicality Score
- Collaboration Score
- Attendance Score
- Creativity Score
- Progress Score
- Feedback Text
- Uploaded File URL
- Recommendation
- Additional Notes

## 15. Common Problems

If submissions fail:

1. Check `GOOGLE_APPS_SCRIPT_URL`.
2. Check that `GOOGLE_APPS_SCRIPT_TOKEN` exactly matches Apps Script `API_TOKEN`.
3. Confirm Apps Script is deployed as a web app.
4. Confirm web app access is **Anyone**.
5. Open Apps Script **Executions** to read the error.

If the website says `Apps Script returned an invalid response`:

1. Confirm the URL in `.env.local` or Vercel is the Apps Script **Web app URL**.
2. The URL must end with:

```text
/exec
```

3. Do not use a URL ending with:

```text
/dev
```

4. In Apps Script, click **Deploy > Manage deployments**.
5. Edit the active web app deployment.
6. Confirm:

```text
Execute as: Me
Who has access: Anyone
```

7. Open the Apps Script URL in your browser. It should show a JSON message like:

```json
{"ok":true,"app":"StartupTeen Team Feedback System"}
```

8. If you see a Google login page, permission page, or HTML error page, the web app access setting or URL is wrong.

If admin login fails:

1. Confirm the email is listed in `ADMIN_EMAILS`.
2. Confirm Google OAuth redirect URI matches your exact site URL.
3. Confirm `NEXTAUTH_URL` matches your exact local or Vercel URL.
4. Confirm `NEXTAUTH_SECRET` is set.

If uploaded file links cannot be opened:

1. Open the Drive folder created by Apps Script.
2. Share the folder with admin users, or set `fileSharing` to `ANYONE_WITH_LINK` in `scripts/Code.gs`.
3. Redeploy Apps Script after changing file sharing.
