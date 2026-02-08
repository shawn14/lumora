export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
}

export interface App {
  id: string;
  name: string;
  description: string;
  url?: string;
  targetAudience?: string;
  questions: string[];
  screenshots: string[];
  status: AppStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppStatus = "draft" | "published" | "archived";

export interface AppWithCounts extends App {
  reviewCount: number;
  averageScore: number;
  user?: { name: string | null; email: string };
}

export const REVIEW_CATEGORIES = [
  { key: "uiDesign", label: "UI Design" },
  { key: "uxFlow", label: "UX Flow" },
  { key: "performance", label: "Performance" },
  { key: "functionality", label: "Functionality" },
  { key: "innovation", label: "Innovation" },
  { key: "overall", label: "Overall Polish" },
] as const;

export type RatingCategory = (typeof REVIEW_CATEGORIES)[number]["key"];

export interface RatingMap {
  uiDesign: number;
  uxFlow: number;
  performance: number;
  functionality: number;
  innovation: number;
  overall: number;
}

export interface Review {
  id: string;
  isAI: boolean;
  ratings: RatingMap;
  overallScore: number;
  feedback: string;
  suggestions: string[];
  appId: string;
  reviewerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithDetails extends Review {
  reviewer?: { name: string | null; email: string };
  app?: { name: string; id: string };
}

export interface ReviewSummary {
  totalReviews: number;
  aiReviews: number;
  humanReviews: number;
  averageScores: RatingMap;
  overallAverage: number;
}
