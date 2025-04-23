// Helper function to compare objects and return changed fields
export function getChangedFields(original, current) {
  const changes = {}

  try {
    // If either object is null or undefined, return empty changes
    if (!original || !current) return changes

    for (const key in current) {

      if(key==="organization_id"){
        // Skip organization_id as it is not a field to be compared
        continue
      }
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

// Helper to check if a form has unsaved changes
export function hasUnsavedChanges(original, current) {
  try {
    if (!original || !current) return false
    return Object.keys(getChangedFields(original, current)).length > 0
  } catch (error) {
    console.error("Error in hasUnsavedChanges:", error)
    return false
  }
}

// Safe JSON parse with fallback
export function safeJsonParse(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return fallback
  }
}

// Debounce function to prevent excessive updates
export function debounce(func, wait){
  let timeout = null

  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Deep equality check for objects
export function isEqual(obj1, obj2) {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  } catch (error) {
    console.error("Error in isEqual:", error)
    return false
  }
}
