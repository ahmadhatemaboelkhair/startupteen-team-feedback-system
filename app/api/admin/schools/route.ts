import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callAppsScript } from "@/lib/appsScript";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await callAppsScript<{ schools: string[] }>("listSchools", {
      adminEmail: session.user.email
    });
    return NextResponse.json({ ok: true, schools: data.schools ?? [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load schools." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schoolName = String(body.schoolName ?? "").trim();

    if (!schoolName) {
      return NextResponse.json({ ok: false, error: "School name is required." }, { status: 400 });
    }

    const data = await callAppsScript<{ schools: string[] }>("addSchool", {
      schoolName,
      adminEmail: session.user.email
    });

    return NextResponse.json({ ok: true, schools: data.schools ?? [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to add school." },
      { status: 500 }
    );
  }
}
