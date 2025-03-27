import { useRouter } from "next/navigation";
export const api = "http://localhost:8000/api";

export async function fetchWithAuth(url, options = {}) {
    options.credentials = "include";  // Send cookies with request

    let response = await fetch(`${api}${url}`, options);

    if (!options.headers) {
        options.headers = {
            "Content-Type": "application/json",
        };
    }
    
    if (!options.method) {
        options.method = "GET";
    }
    
    if (response.status === 401) {
        await refreshAccessToken();
        response = await fetch(`${api}${url}`, options);  // Retry the request
    }

    return response;
}

// Custom hook
async function refreshAccessToken() {
    try {
        const response = await fetch(`${api}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Session expired");
        }

        console.log("Access token refreshed");
        return true;
    } catch (error) {
        console.error("Refresh failed, redirecting to login...");
        window.location.href = "/login";  // ✅ Redirect manually
        return false;
    }
}

