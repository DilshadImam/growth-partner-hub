import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({ 
  children, 
  className, 
  centered = true 
}: SectionHeadingProps) {
  return (
    <div className={cn("inline-block", centered && "mx-auto text-center")}>
      <h2 className={cn(
        "brush-stroke-heading font-heading font-bold text-black",
        className
      )}>
        {children}
      </h2>
    </div>
  );
}
