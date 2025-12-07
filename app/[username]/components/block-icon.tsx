"use client"

import { getSocialIcon } from "@/lib/social-icons"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"

interface BlockIconProps {
  icon: string | null
  className?: string
  animations?: AnimationLevel
}

export function BlockIcon({ icon, className = "", animations = "all" }: BlockIconProps) {
  if (!icon) return null

  const animClasses = getAnimationClasses(animations)
  const socialIcon = getSocialIcon(icon)
  
  if (socialIcon) {
    const IconComponent = socialIcon.icon
    return (
      <IconComponent 
        className={`${className || "text-lg"} ${animClasses.iconHover}`}
        style={{ color: socialIcon.color }}
      />
    )
  }

  // Si ce n'est pas une icône sociale, afficher comme emoji
  return <span className={`${className || ""} ${animClasses.iconHover}`}>{icon}</span>
}

