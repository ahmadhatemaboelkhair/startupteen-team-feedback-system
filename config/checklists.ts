export const sessions = [
  "Session 1",
  "Session 2",
  "Session 3",
  "Session 4",
  "Session 5",
  "Session 6",
  "Session 7",
  "Session 8"
] as const;

export type SessionNumber = (typeof sessions)[number];

export const sessionChecklists: Record<SessionNumber, string[]> = {
  "Session 1": ["Problem Statement"],
  "Session 2": ["Positioning Statement", "Value Proposition"],
  "Session 3": [
    "Business Model Canvas",
    "Marketing Plan",
    "Plan the 4 Ps",
    "Brand Mantra"
  ],
  "Session 4": [
    "Revisit Your Solution",
    "Validate Your Segment",
    "Compare With Competitors",
    "Revisit Your Business",
    "Tune Your Marketing Strategy",
    "4Ps Alignment Check",
    "AI-Powered Wireframing",
    "Visual Blueprint Of Product"
  ],
  "Session 5": ["Marketing Strategy", "Startup Logo", "AI Content Calendar"],
  "Session 6": [
    "Product Visual Identity",
    "Color Harmony Check",
    "Find Your Visual Voice",
    "Spot Early Adopters",
    "AI Generated Ad Mockup",
    "Prepare Response Plan",
    "Trace User Flow",
    "Start Testing"
  ],
  "Session 7": ["Pitching Your Idea", "Pitch Deck"],
  "Session 8": ["Practice Your Pitch", "Final Fixes", "Final Demo"]
};

export const allChecklistItems = Array.from(
  new Set(Object.values(sessionChecklists).flat())
);
