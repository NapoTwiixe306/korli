import { describe, it, expect } from "vitest"

function weightedPick(groups: Record<string, number>, roll: number) {
  const entries = Object.entries(groups)
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let acc = 0
  for (const [g, w] of entries) {
    acc += w
    if (roll <= acc / total) return g
  }
  return entries[0]?.[0] || null
}

describe("ab selection", () => {
  it("picks highest weight more often (deterministic test)", () => {
    const groups = { A: 100, B: 50 }
    // Simulate buckets: with roll 0.3 => A, 0.9 => B
    expect(weightedPick(groups, 0.3)).toBe("A")
    expect(weightedPick(groups, 0.9)).toBe("B")
  })
})
