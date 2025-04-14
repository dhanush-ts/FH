"use client";
export const api = "http://localhost:8000/api";
import { redirectToLogin } from "@/lib/routerService";
import { toast } from "sonner";


export async function fetchWithAuth(url, options = {},key = false) { 
    options.credentials = "include";  // Ensure cookies are sent

    if (!options.headers && !key) {
        options.headers = {
            "Content-Type": "application/json",
        };
    }

    if (!options.method) {
        options.method = "GET";
    }

    let response = await fetch(`${api}${url}`, options);
    const cloned = response.clone();
    const data = await cloned.json();

    toast(JSON.stringify(data));
    // console.log(data)

    // if (response.status === 401) {
        // const success = await refreshAccessToken();
        // if (success) {
        //     response = await fetch(`${api}${url}`, options);  // Retry request
        // } else {
        //     redirectToLogin(); // ✅ Redirect to login if refresh fails
        // }
            // redirectToLogin(); // ✅ Redirect to login if refresh fails
    // }

    return response;
}

// ✅ Safe function to refresh token
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
        console.log("Refresh failed, redirecting to login...");
        redirectToLogin(); // ✅ Redirect to login on failure
        return false;
    }
}
