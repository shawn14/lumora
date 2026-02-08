export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Study {
  id: string;
  name: string;
  goal: string;
  targetAudience: string;
  type: StudyType;
  status: StudyStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type StudyType = "exploratory" | "concept_test" | "usability_test" | "journey_map";
export type StudyStatus = "draft" | "active" | "completed" | "archived";

export interface DiscussionGuide {
  id: string;
  studyId: string;
  sections: GuideSection[];
}

export interface GuideSection {
  title: string;
  objective: string;
  questions: string[];
}

export interface Interview {
  id: string;
  studyId: string;
  participantName: string;
  status: "scheduled" | "in_progress" | "completed";
  messages: Message[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  role: "ai" | "participant";
  content: string;
  timestamp: Date;
}

export interface Insight {
  id: string;
  studyId: string;
  themes: Theme[];
  summary: string;
  recommendations: string[];
  generatedAt: Date;
}

export interface Theme {
  name: string;
  description: string;
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  quotes: string[];
  frequency: number;
}
