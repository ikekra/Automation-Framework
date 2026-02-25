"use client";

import { motion as Motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  index
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Card className="h-full bg-gradient-to-br from-white/70 to-white/35 transition-all duration-[250ms] group-hover:shadow-[0_26px_50px_-30px_rgba(99,102,241,0.85)] dark:from-white/12 dark:to-white/5">
        <CardHeader>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-slate-900 dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </CardContent>
      </Card>
    </Motion.div>
  );
};
