"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
    const cokie = await cookies();
    cokie.delete("jwt");
    cokie.delete("user_type");
    redirect("/login");
}