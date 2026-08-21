import type { PillarStatus } from "@/lib/domain/pillars";
import { STATUS_COLOR, STATUS_DIM } from "./confidence-style";

export function StatusBadge({ status }: { status: PillarStatus }) {
  return (
    <span
      className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide"
      style={{ background: STATUS_DIM[status], color: STATUS_COLOR[status] }}
    >
      {status}
    </span>
  );
}
