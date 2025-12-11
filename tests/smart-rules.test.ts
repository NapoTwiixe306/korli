import { describe, it, expect } from "vitest"
import {
  matchesConditions,
  applyRuleAction,
  autoReorderByTrafficSource,
  type RuleCondition,
  type RuleAction,
} from "@/lib/smart-rules"

describe("smart-rules", () => {
  const traffic = {
    source: "instagram",
    device: "mobile",
    country: "fr",
    time: { hour: 10, dayOfWeek: 1 },
    visitorType: "new" as const,
  }

  it("matchesConditions should respect all filters", () => {
    const conditions: RuleCondition = {
      trafficSource: ["instagram"],
      device: ["mobile"],
      country: ["fr"],
      dayOfWeek: [1],
      visitorType: "new",
    }
    expect(matchesConditions(traffic, conditions)).toBe(true)
    expect(matchesConditions(traffic, { ...conditions, trafficSource: ["tiktok"] })).toBe(false)
  })

  it("applyRuleAction hide should remove specified blocks", () => {
    const blocks = [{ id: "a" }, { id: "b" }]
    const action: RuleAction = { type: "hide", blockIds: ["b"] }
    const res = applyRuleAction(blocks, action)
    expect(res).toEqual([{ id: "a" }])
  })

  it("autoReorderByTrafficSource should prioritize matching links", () => {
    const blocks = [
      { id: "1", url: "https://tiktok.com/abc" },
      { id: "2", url: "https://instagram.com/me" },
    ]
    const reordered = autoReorderByTrafficSource(blocks, "instagram")
    expect(reordered[0].id).toBe("2")
  })
})
