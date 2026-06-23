import { NextResponse } from "next/server";
import { schools as fallbackSchools } from "@/config/schools";
import { callAppsScript } from "@/lib/appsScript";

export async function GET() {
  try {
    const data = await callAppsScript<{ schools: string[] }>("listSchools");
    return NextResponse.json({ ok: true, schools: data.schools?.length ? data.schools : fallbackSchools });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      schools: fallbackSchools,
      warning: error instanceof Error ? error.message : "Using fallback schools."
    });
  }
}
