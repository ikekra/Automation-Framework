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
    <Motion.article whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className={highlighted ? "border-blue-500 dark:border-blue-600" : ""}>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">{tier}</CardTitle>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{price}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Check className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full" variant={highlighted ? "default" : "secondary"}>
            {highlighted ? "Choose Pro" : "Select Plan"}
          </Button>
        </CardContent>
      </Card>
    </Motion.article>
  );
};
