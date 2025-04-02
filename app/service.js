const serverapi = "http://127.0.0.1:8000/api"
import { cookies } from "next/headers";

async function serverSideFetch(url) {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

    const response = await fetch(`${serverapi}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store", // Ensures fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in serverSideFetch:", error);
    return null; // Return null or an empty object/array based on your needs
  }
}

export default serverSideFetch;