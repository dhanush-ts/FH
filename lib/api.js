import { useRouter } from "next/navigation";
export const api = "http://127.0.0.1:8000/api";

export async function fetchWithAuth(url, options = {}, refreshToken) {
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
    
    if (response.status === 401 && refreshToken) {
        await refreshToken();
        response = await fetch(`${api}${url}`, options);  // Retry the request
    }

    return response.json();
}

// Custom hook
export function useRefreshToken() {
    const router = useRouter();

    return async function refreshToken() {
        try {
            const response = await fetch(`${api}/<refresh-endpoint>/`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Session expired");
            }

            console.log("Access token refreshed");
        } catch (error) {
            console.error("Refresh failed, redirecting to login...");
            router.push("/login");
        }
    };
}
