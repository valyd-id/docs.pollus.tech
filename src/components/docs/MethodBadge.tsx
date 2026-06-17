import { cn } from "@/lib/utils";

interface MethodBadgeProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

const methodStyles = {
  GET: "bg-green-100 text-green-700 border-green-200",
  POST: "bg-blue-100 text-blue-700 border-blue-200",
  PUT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  PATCH: "bg-purple-100 text-purple-700 border-purple-200",
};

export const MethodBadge = ({ method }: MethodBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase border",
        methodStyles[method]
      )}
    >
      {method}
    </span>
  );
};
