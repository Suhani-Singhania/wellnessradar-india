import { useEffect, useState } from "react";

interface ScoreBarProps {
  label: string;
  score: number;
  max?: number;
  description?: string;
}

export const ScoreBar = ({ label, score, max = 25, description }: ScoreBarProps) => {
  const [width, setWidth] = useState(0);
  const percentage = (score / max) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-bold text-foreground">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground/70">{description}</p>
      )}
    </div>
  );
};
