import { allChecklistItems } from "@/config/checklists";
import type { FeedbackPayload, Scores } from "@/types/feedback";

export const scoreLabels: Array<{ key: keyof Scores; label: string; column: string }> = [
  { key: "presentation", label: "Presentation Quality", column: "Presentation Score" },
  { key: "idea", label: "Idea Quality", column: "Idea Score" },
  { key: "technicality", label: "Technicality", column: "Technicality Score" },
  { key: "collaboration", label: "Team Collaboration", column: "Collaboration Score" },
  { key: "attendance", label: "Attendance Rate", column: "Attendance Score" },
  { key: "creativity", label: "Creativity", column: "Creativity Score" },
  { key: "progress", label: "Progress Compared To Previous Session", column: "Progress Score" }
];

export const initialScores: Scores = {
  presentation: 7,
  idea: 7,
  technicality: 7,
  collaboration: 7,
  attendance: 7,
  creativity: 7,
  progress: 7
};

export function averageScore(scores: Scores) {
  const values = Object.values(scores);
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function createSubmissionId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `STF-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export function validateFeedbackPayload(payload: FeedbackPayload) {
  if (!/^T-\d{5}$/.test(payload.tutorId)) {
    return "Tutor ID must use the format T-#####.";
  }
  if (!/^G-\d{4}$/.test(payload.groupId)) {
    return "Group ID must use the format G-####.";
  }
  if (!payload.tutorName || !payload.school || !payload.teamName) {
    return "Please complete all required tutor and team fields.";
  }
  if (!payload.membersCount || payload.membersCount < 1) {
    return "Team members count must be at least 1.";
  }
  if (!payload.sessionDate || !payload.sessionNumber) {
    return "Please select the session date and session number.";
  }
  if (!payload.feedbackText.trim()) {
    return "Please write feedback or upload a feedback document.";
  }
  return null;
}

export function checklistColumns() {
  return allChecklistItems.flatMap((item) => [`${item} Completed`, `${item} Notes`]);
}
