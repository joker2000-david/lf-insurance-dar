import { ReactNode } from "react";

interface LegalContentProps {
  lastUpdated?: string;
  children: ReactNode;
}

const LegalContent = ({ lastUpdated = "January 2026", children }: LegalContentProps) => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-4xl">
      <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
      <div className="prose prose-slate max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-accent">
        {children}
      </div>
    </div>
  </section>
);

export default LegalContent;
