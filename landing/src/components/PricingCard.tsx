"use client";

import { motion as Motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PricingCard = ({
  tier,
  price,
  description,
  features,
  highlighted
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) => {
  return (
    <Motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Card
        className={`h-full ${
          highlighted
            ? "border-indigo-400/70 bg-gradient-to-b from-indigo-500/20 to-slate-900/80 text-white"
            : "bg-white/60 text-slate-900 dark:bg-white/8 dark:text-slate-100"
        }`}
      >
        <CardHeader>
          <CardTitle className={highlighted ? "text-white" : "text-slate-900 dark:text-white"}>{tier}</CardTitle>
          <p className={highlighted ? "text-3xl font-bold text-white" : "text-3xl font-bold text-slate-900 dark:text-white"}>{price}</p>
          <p className={highlighted ? "text-sm text-slate-200" : "text-sm text-slate-600 dark:text-slate-300"}>{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className={highlighted ? "flex items-start gap-2 text-sm text-slate-100" : "flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"}>
                <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full" variant={highlighted ? "default" : "secondary"}>
            {highlighted ? "Choose Pro" : "Select Plan"}
          </Button>
        </CardContent>
      </Card>
    </Motion.div>
  );
};
