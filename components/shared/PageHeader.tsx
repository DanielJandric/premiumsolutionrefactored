interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: PageHeaderProps) {
  return (
    <div
      className={`mx-auto max-w-3xl space-y-4 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
