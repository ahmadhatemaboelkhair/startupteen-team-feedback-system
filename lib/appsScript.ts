type AppsScriptRequest = {
  action: string;
  token: string;
  payload?: unknown;
};

export async function callAppsScript<T>(action: string, payload?: unknown): Promise<T> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

  if (!url || !token) {
    throw new Error("Google Apps Script environment variables are not configured.");
  }

  const body: AppsScriptRequest = { action, token, payload };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const text = await response.text();
  let data: { ok?: boolean; error?: string } & T;

  try {
    data = JSON.parse(text);
  } catch {
    const preview = text.replace(/\s+/g, " ").slice(0, 180);
    throw new Error(
      `Apps Script returned an invalid response. Check that GOOGLE_APPS_SCRIPT_URL is the deployed /exec web app URL and access is set to Anyone. Response preview: ${preview}`
    );
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Apps Script request failed.");
  }

  return data;
}
