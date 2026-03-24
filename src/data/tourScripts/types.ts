export interface TourSegment {
  id: string;
  guide: "jeeves" | "reginald";
  floor: number;
  floorName: string;
  roomCode: string;
  roomName: string;
  title: string;
  script: string;
  estimatedSeconds: number;
}

export interface TourDefinition {
  id: string;
  title: string;
  subtitle: string;
  verse: string;
  verseText: string;
  emoji: string;
  intro: TourSegment;
  segments: TourSegment[];
  outro: TourSegment;
}

export function buildAllSegments(tour: TourDefinition): TourSegment[] {
  return [tour.intro, ...tour.segments, tour.outro];
}

export function getTotalSeconds(tour: TourDefinition): number {
  return buildAllSegments(tour).reduce((sum, s) => sum + s.estimatedSeconds, 0);
}
