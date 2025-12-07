/**
 * Animation system for user pages.
 * 
 * Provides three animation levels with corresponding CSS classes for transitions,
 * transforms, and hover effects.
 */

export type AnimationLevel = "all" | "minimal" | "none"

/**
 * CSS class mappings for animation styling.
 */
export interface AnimationClasses {
  blockHover: string
  blockTransition: string
  blockTransform: string
  iconHover: string
  pageTransition: string
}

/**
 * Retrieves CSS classes for a given animation level.
 * 
 * @param level - Animation level ("all", "minimal", or "none")
 * @returns AnimationClasses object with Tailwind CSS classes
 * 
 * @remarks
 * - "all": Full animations with scale, shadow, and transform effects
 * - "minimal": Light hover effects only
 * - "none": No animations
 */
export function getAnimationClasses(level: AnimationLevel): AnimationClasses {
  switch (level) {
    case "all":
      return {
        blockHover: "hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:border-opacity-80",
        blockTransition: "transition-all duration-300 ease-out",
        blockTransform: "transform",
        iconHover: "hover:scale-110 transition-transform duration-200",
        pageTransition: "animate-fade-in",
      }
    case "minimal":
      return {
        blockHover: "hover:shadow-md hover:opacity-90",
        blockTransition: "transition-all duration-200 ease-in-out",
        blockTransform: "",
        iconHover: "",
        pageTransition: "",
      }
    case "none":
      return {
        blockHover: "",
        blockTransition: "",
        blockTransform: "",
        iconHover: "",
        pageTransition: "",
      }
    default:
      return getAnimationClasses("all")
  }
}
