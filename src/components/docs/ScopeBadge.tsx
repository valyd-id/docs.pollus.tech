import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface ScopeBadgeProps {
  scope: string;
  required?: boolean;
  size?: "sm" | "md";
}

export const ScopeBadge = ({ scope, required = false, size = "sm" }: ScopeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-mono",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        required
          ? "bg-orange-100 text-orange-700 border border-orange-200"
          : "bg-blue-100 text-blue-700 border border-blue-200"
      )}
    >
      <Shield className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      {scope}
      {required && <span className="text-orange-500">*</span>}
    </span>
  );
};
