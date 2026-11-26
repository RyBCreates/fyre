import type { RunEvent } from "@/types/RunEvent";

export const testRun: RunEvent = {
  id: "test-run-1",
  title: "Easy Run over the Bridge",
  startLocation: "123 Bridge St",
  startsAt: new Date("2026-12-05T18:30:00-05:00").toISOString(),
  difficulty: "beginner",
  distanceMiles: 3,
};
