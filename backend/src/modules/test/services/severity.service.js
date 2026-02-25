const rank = {
  High: 3,
  Medium: 2,
  Low: 1
};

export const getEntrySeverity = (entry, kind) => {
  if (kind === "console" || kind === "exception") {
    return "High";
  }

  if (entry?.failureText) {
    return "High";
  }

  if ((entry?.status || 0) >= 500) {
    return "High";
  }

  if ((entry?.status || 0) >= 400) {
    return "Medium";
  }

  return "Low";
};

export const computeReportSeveritySummary = (reportLike) => {
  const counts = { High: 0, Medium: 0, Low: 0 };

  for (const error of reportLike.consoleErrors || []) {
    counts[getEntrySeverity(error, "console")] += 1;
  }

  for (const error of reportLike.jsExceptions || []) {
    counts[getEntrySeverity(error, "exception")] += 1;
  }

  for (const error of reportLike.networkErrors || []) {
    counts[getEntrySeverity(error, "network")] += 1;
  }

  const overallSeverity =
    counts.High > 0 ? "High" : counts.Medium > 0 ? "Medium" : "Low";

  const score = counts.High * rank.High + counts.Medium * rank.Medium + counts.Low * rank.Low;

  return {
    highCount: counts.High,
    mediumCount: counts.Medium,
    lowCount: counts.Low,
    overallSeverity,
    score
  };
};
