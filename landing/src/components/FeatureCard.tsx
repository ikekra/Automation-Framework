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
    <Motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full hover:border-blue-300 dark:hover:border-blue-800">
        <CardHeader>
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="text-slate-900 dark:text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </CardContent>
      </Card>
    </Motion.article>
  );
};
