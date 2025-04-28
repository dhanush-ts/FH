import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getChangedFields(original, current) {
  const changes = {}

  try {
    // If either object is null or undefined, return empty changes
    if (!original || !current) return changes

    for (const key in current) {
      // Skip if the property doesn't exist in the original
      if (!(key in original)) {
        changes[key] = current[key]
        continue
      }

      // Handle different types of values
      if (typeof current[key] === "object" && current[key] !== null) {
        // Handle Date objects
        if (current[key] instanceof Date && original[key] instanceof Date) {
          if (current[key].getTime() !== original[key].getTime()) {
            changes[key] = current[key]
          }
        }
        // Handle arrays
        else if (Array.isArray(current[key]) && Array.isArray(original[key])) {
          if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
            changes[key] = current[key]
          }
        }
        // Handle other objects
        else if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
          changes[key] = current[key]
        }
      }
      // Handle primitive values
      else if (current[key] !== original[key]) {
        changes[key] = current[key]
      }
    }
  } catch (error) {
    console.error("Error in getChangedFields:", error)
  }

  return changes
}