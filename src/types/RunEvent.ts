export type RunEvent = {
  id: string;
  title: string;
  startLocation: string;
  startsAt: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  distanceMiles: number;
  attendeeCount: number;
  isJoined: boolean;
};
