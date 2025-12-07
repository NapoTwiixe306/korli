import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * 
 * @param inputs - Class values (strings, arrays, objects)
 * @returns Merged class string
 * 
 * @example
 * ```ts
 * cn("px-2 py-1", "px-4") // "py-1 px-4"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a URL-friendly username from email or name.
 * 
 * @param email - User email address
 * @param name - Optional user name
 * @returns Generated username slug
 * 
 * @remarks
 * - Prefers name if provided and valid (>= 3 chars)
 * - Falls back to email local part
 * - Normalizes accents, converts to lowercase, replaces special chars with dashes
 */
export function generateUsername(email: string, name?: string | null): string {
  if (name) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    
    if (slug.length >= 3) {
      return slug
    }
  }
  
  const emailPart = email.split("@")[0]
  return emailPart
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Ensures username uniqueness by appending incremental numbers.
 * 
 * @param baseUsername - Base username to make unique
 * @param checkExists - Async function to check if username exists
 * @returns Unique username
 * 
 * @example
 * ```ts
 * const unique = await makeUsernameUnique("john", (u) => prisma.user.findUnique({ where: { username: u } }))
 * // Returns "john", "john1", "john2", etc. until unique
 * ```
 */
export async function makeUsernameUnique(
  baseUsername: string,
  checkExists: (username: string) => Promise<boolean>
): Promise<string> {
  let username = baseUsername
  let counter = 1
  
  while (await checkExists(username)) {
    username = `${baseUsername}${counter}`
    counter++
  }
  
  return username
}
