/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates that a URL is safe (http/https only)
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Sanitizes a URL to prevent XSS
 */
export function sanitizeUrl(url: string): string {
  // Remove dangerous protocols
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"]
  const lowerUrl = url.toLowerCase().trim()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      throw new Error("URL non autorisée")
    }
  }
  
  return url.trim()
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value.length < min) {
    throw new Error(`${fieldName} doit contenir au moins ${min} caractères`)
  }
  if (value.length > max) {
    throw new Error(`${fieldName} ne peut pas dépasser ${max} caractères`)
  }
}

/**
 * Validates URL length and format
 */
export function validateUrl(url: string): void {
  validateLength(url, 1, 2048, "URL")
  
  if (!isValidUrl(url)) {
    throw new Error("URL invalide. Utilisez http:// ou https://")
  }
  
  sanitizeUrl(url)
}

