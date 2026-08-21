import type { FieldConfidence } from "@/lib/domain/extraction";
import type { PillarStatus } from "@/lib/domain/pillars";

export const CONFIDENCE_COLOR: Record<FieldConfidence, string> = {
  high: "var(--confidence-high)",
  medium: "var(--confidence-medium)",
  low: "var(--confidence-low)",
};

export const CONFIDENCE_DIM: Record<FieldConfidence, string> = {
  high: "var(--confidence-high-dim)",
  medium: "var(--confidence-medium-dim)",
  low: "var(--confidence-low-dim)",
};

export const STATUS_COLOR: Record<PillarStatus, string> = {
  found: "var(--status-found)",
  ambiguous: "var(--status-ambiguous)",
  absent: "var(--status-absent)",
};

export const STATUS_DIM: Record<PillarStatus, string> = {
  found: "var(--status-found-dim)",
  ambiguous: "var(--status-ambiguous-dim)",
  absent: "var(--status-absent-dim)",
};
