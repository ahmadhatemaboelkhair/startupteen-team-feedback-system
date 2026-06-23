import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/appsScript";
import { createSubmissionId, validateFeedbackPayload } from "@/lib/submission";
import type { FeedbackPayload, UploadedFilePayload } from "@/types/feedback";

const acceptedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

async function fileToPayload(file: File): Promise<UploadedFilePayload | null> {
  if (!file || file.size === 0) {
    return null;
  }

  if (!acceptedTypes.has(file.type)) {
    throw new Error("Unsupported feedback file type.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    name: file.name,
    mimeType: file.type,
    data: buffer.toString("base64")
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payloadRaw = formData.get("payload");
    const file = formData.get("file");

    if (typeof payloadRaw !== "string") {
      return NextResponse.json({ ok: false, error: "Missing submission payload." }, { status: 400 });
    }

    const payload = JSON.parse(payloadRaw) as FeedbackPayload;
    const uploadedFile = file instanceof File ? await fileToPayload(file) : null;
    const validationError = validateFeedbackPayload({
      ...payload,
      feedbackText: payload.feedbackText || (uploadedFile ? "Uploaded feedback document" : "")
    });

    if (validationError) {
      return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
    }

    const submissionId = createSubmissionId();
    const result = await callAppsScript<{ uploadedFileUrl?: string }>("submitFeedback", {
      submissionId,
      submission: payload,
      uploadedFile
    });

    return NextResponse.json({
      ok: true,
      submissionId,
      uploadedFileUrl: result.uploadedFileUrl ?? ""
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Submission failed." },
      { status: 500 }
    );
  }
}
