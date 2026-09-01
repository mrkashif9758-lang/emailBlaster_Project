export type DomainStatus = "verified" | "failed";

export interface ReputationInput {
  bounceRate: number;
  spamComplaints: number;
  unsubscribeRate: number;
  openRate: number;
  deliveryRate: number;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateDomainReputation({
  bounceRate,
  spamComplaints,
  unsubscribeRate,
  openRate,
  deliveryRate,
}: ReputationInput) {
  let score = 100;

  score -= bounceRate * 5;
  score -= spamComplaints * 10;
  score -= unsubscribeRate * 2;

  score += openRate * 0.4;
  score += deliveryRate * 0.3;

  return Math.round(clamp(score, 0, 100));
}

export function getDomainStatus(value: number): DomainStatus {
  return value >= 80 ? "verified" : "failed";
}

export function buildLast7DaySeries<T extends Record<string, number>>(values: Array<{ day: string; value: number }>) {
  return values.map((entry) => ({ day: entry.day, value: Number(entry.value) || 0 }));
}
