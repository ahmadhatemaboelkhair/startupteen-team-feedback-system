import type { SessionNumber } from "@/config/checklists";

export type CompletionStatus = "Yes" | "Partially" | "No";

export type ChecklistResponse = {
  item: string;
  completed: CompletionStatus;
  notes: string;
};

export type Scores = {
  presentation: number;
  idea: number;
  technicality: number;
  collaboration: number;
  attendance: number;
  creativity: number;
  progress: number;
};

export type FeedbackPayload = {
  tutorId: string;
  tutorName: string;
  school: string;
  groupId: string;
  teamName: string;
  membersCount: number;
  sessionDate: string;
  sessionNumber: SessionNumber;
  checklist: ChecklistResponse[];
  scores: Scores;
  feedbackText: string;
  recommendation: "Excellent" | "Good" | "Needs Improvement" | "Critical Attention Needed";
  additionalNotes: string;
};

export type UploadedFilePayload = {
  name: string;
  mimeType: string;
  data: string;
};

export type SubmissionRow = {
  timestamp: string;
  submissionId: string;
  tutorId: string;
  tutorName: string;
  school: string;
  groupId: string;
  teamName: string;
  membersCount: number;
  sessionDate: string;
  sessionNumber: string;
  presentationScore: number;
  ideaScore: number;
  technicalityScore: number;
  collaborationScore: number;
  attendanceScore: number;
  creativityScore: number;
  progressScore: number;
  feedbackText: string;
  uploadedFileUrl: string;
  recommendation: string;
  additionalNotes: string;
  checklist: Record<string, string>;
};
