import { clsx, type ClassValue } from "clsx";

/**
 * Utility to merge Tailwind CSS classes with confidence
 * Combines clsx and cn patterns for dynamic class management
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
