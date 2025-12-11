import { describe, it, expect } from "vitest"

interface VariantRow {
  variant: string
  views: number
  clicks: number
}

function computeVariantCTR(rows: VariantRow[]) {
  return rows.map((r) => ({
    ...r,
    ctr: r.views > 0 ? Number(((r.clicks / r.views) * 100).toFixed(1)) : 0,
  }))
}

describe("analytics aggregations", () => {
  it("computes CTR per variant", () => {
    const rows = [
      { variant: "A", views: 100, clicks: 20 },
      { variant: "B", views: 50, clicks: 5 },
    ]
    const res = computeVariantCTR(rows)
    expect(res[0].ctr).toBe(20)
    expect(res[1].ctr).toBe(10)
  })
})
