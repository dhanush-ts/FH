import { api } from "@/app/api"
import { getCookie } from "cookies-next"

const API_BASE_URL = api

const getAuthHeader = () => {
  const token = getCookie("jwt")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Generic fetch function with authentication
export async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Generic create function
export async function createData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Generic update function
export async function updateData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Generic delete function
export async function deleteData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
}

