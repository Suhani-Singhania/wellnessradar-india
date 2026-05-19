import { useEffect, useState } from "react";

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularScore = ({ score, size = 56, strokeWidth = 4 }: CircularScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score >= 75) return "stroke-destructive";
    if (score >= 60) return "stroke-accent";
    if (score >= 45) return "stroke-yellow-400";
    return "stroke-muted-foreground";
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getColor()} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black font-mono text-foreground">{score}</span>
      </div>
    </div>
  );
};
