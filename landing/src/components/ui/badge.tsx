import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex items-center rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs font-medium text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-slate-100",
      className
    )}
    {...props}
  />
);
