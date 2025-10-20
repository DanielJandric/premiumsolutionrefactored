interface WaveDividerProps {
  className?: string;
  flip?: boolean;
  color?: "primary" | "secondary" | "background";
}

export function WaveDivider({ className = "", flip = false, color = "background" }: WaveDividerProps) {
  const colors = {
    primary: "fill-primary/10",
    secondary: "fill-secondary/10",
    background: "fill-background",
  };

  return (
    <div className={`relative w-full ${className}`} style={{ transform: flip ? "scaleY(-1)" : undefined }}>
      <svg
        className="w-full h-12 md:h-16 lg:h-20"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"
          className={colors[color]}
        />
      </svg>
    </div>
  );
}
