/**
 * Converts a date string to a local ISO string without timezone information
 * This ensures dates are treated as local dates without timezone adjustments
 */
export function toLocalISOString(date) {
    const d = typeof date === "string" ? new Date(date) : date
  
    // Get local date components
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    const seconds = String(d.getSeconds()).padStart(2, "0")
  
    // Format as YYYY-MM-DDTHH:MM:SS (local time, no timezone)
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }
  
  /**
   * Formats a date string to YYYY-MM-DDTHH:MM format for datetime-local inputs
   */
  export function formatForDateTimeInput(date) {
    const d = typeof date === "string" ? new Date(date) : date
    return toLocalISOString(d).slice(0, 16)
  }
  
  /**
   * Converts a local date to an ISO string with the correct timezone offset
   * for sending to the backend
   */
  export function formatDateForBackend(dateString) {
    if (!dateString) return null
  
    // Create a date object from the input (interpreted as local time)
    const date = new Date(dateString)
  
    // Return the ISO string which includes the timezone
    return date.toISOString()
  }
  