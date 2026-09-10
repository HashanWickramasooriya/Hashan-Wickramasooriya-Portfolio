interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <div className="text-accent flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase">
        <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
        {eyebrow}
      </div>
      <h2 className="font-display text-h2 mt-4 leading-[1.1] font-semibold tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {description ? (
        <p className="text-muted mt-4 text-base leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
