export type Activity = {
  id: string;
  type: "run" | "walk";
  distanceMiles: number;
  completedAt: string;
  durationMilliseconds?: number;
};
