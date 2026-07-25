/** D01 tur veri şeması — d01-tur-veri-semasi.md ile birebir uyumlu */

export type SourceType =
  | "sozlu" | "maddi" | "anitsal" | "yazili" | "cografi"
  | "guzergah" | "arkeolojik" | "karsilastirmali" | "sentez";

export type Emotion = "sicak" | "saygili" | "sakin" | "dusunceli" | "torensel";

export type QuestType =
  | "secim" | "coklu_secim" | "eslestir" | "sirala" | "siniflandir" | "baglanti";

export interface Narration {
  id: string;
  type: "intro" | "main_a" | "main_b";
  emotion: Emotion;
  audio: string;
  text: string;
}

export interface Hotspot {
  id: string;
  assetRef: string;
  position: [number, number, number];
  label: string;
  audio: string;
  required: boolean;
  text: string;
  sourceNote: string | null;
}

export interface QuestOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface QuestHint {
  afterAttempt: number;
  text: string;
}

export interface Quest {
  type: QuestType;
  prompt: string;
  options: QuestOption[];
  hints: QuestHint[];
  successFeedback: string;
}

export interface RewardCard {
  cardId: string;
  title: string;
  concept: string;
  icon: string;
  shortText: string;
}

export interface TourNode {
  schemaVersion: string;
  periodId: string;
  nodeId: string;
  order: number;
  zoneId: string;
  title: string;
  estimatedSeconds: number;
  learningObjective: string;
  sourceType: SourceType;
  world: {
    guidePosition: [number, number, number];
    triggerRadius: number;
    cameraFocus: [number, number, number];
  };
  narration: Narration[];
  hotspots: Hotspot[];
  quest: Quest;
  reward: RewardCard;
  closing: { id: string; audio: string; text: string };
  completion: {
    requiredHotspots: string[];
    requiredQuest: boolean;
    events: string[];
  };
  assets: string[];
  audioFiles: string[];
}
