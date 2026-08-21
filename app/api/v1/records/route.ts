import { NextResponse } from "next/server";
import { CALLS } from "@/data/corpus";
import { buildMeddiccResult } from "@/lib/meddicc/build-result";
import { MeddiccResultSchema, type MeddiccResult } from "@/lib/domain/result";

let cached: MeddiccResult | null = null;

function getMeddiccResult(): MeddiccResult {
  if (!cached) {
    const computed = buildMeddiccResult(CALLS, new Date().toISOString());
    cached = MeddiccResultSchema.parse(computed);
  }
  return cached;
}

/** No auth, no persistence, no rate limit, no input to validate. */
export async function GET() {
  return NextResponse.json(getMeddiccResult());
}
