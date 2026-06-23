import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callAppsScript } from "@/lib/appsScript";
import type { SubmissionRow } from "@/types/feedback";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await callAppsScript<{ submissions: SubmissionRow[] }>("listSubmissions", {
      adminEmail: session.user.email
    });

    return NextResponse.json({ ok: true, submissions: data.submissions ?? [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load submissions." },
      { status: 500 }
    );
  }
}
