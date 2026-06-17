import { cn } from "@/lib/utils";
import { DEMO_USERS, type DemoUser } from "./constants";

interface Props {
  value: DemoUser;
  onChange: (v: DemoUser) => void;
}

export const DemoUserPicker = ({ value, onChange }: Props) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Demo User</h3>
      <div className="space-y-2">
        {DEMO_USERS.map((u) => (
          <label
            key={u.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md cursor-pointer border transition-colors",
              value === u.id
                ? "border-primary bg-primary/5"
                : "border-transparent hover:bg-muted"
            )}
          >
            <input
              type="radio"
              name="demo-user"
              checked={value === u.id}
              onChange={() => onChange(u.id)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-medium text-foreground">{u.label}</span>
            <span className="text-sm text-muted-foreground">— {u.desc}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
