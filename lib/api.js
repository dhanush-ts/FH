import { useAuth } from "@/app/providers";// Import the Auth Context
export const api = "http://localhost:8000/api";

export async function fetchWithAuth(url, options = {}) { 
    options.credentials = "include";  // Ensure cookies are sent

    if (!options.headers) {
        options.headers = {
            "Content-Type": "application/json",
        };
    }

    if (!options.method) {
        options.method = "GET";
    }

    let response = await fetch(`${api}${url}`, options);

    if (response.status === 401) {
        const success = await refreshAccessToken();
        if (success) {
            response = await fetch(`${api}${url}`, options);  // Retry request
        }
    }

    return response;
}

// ✅ Safe function to refresh token & call logout
export async function refreshAccessToken() {
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
        console.error("Refresh failed, logging out...");
        
        // ✅ Call logout from context without using hooks in this function
        const { logout } = useAuth();
        logout(); // Redirect user to login
        return false;
    }
}
