import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIReviewBadgeProps {
  isAI: boolean;
}

export function AIReviewBadge({ isAI }: AIReviewBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isAI
          ? "bg-lumora-100 text-lumora-700"
          : "bg-gray-100 text-gray-600"
      )}
    >
      {isAI ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
      {isAI ? "AI Review" : "Community Review"}
    </span>
  );
}
