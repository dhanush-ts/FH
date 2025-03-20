"use server"

import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { api } from "@/app/api"
import { cookies } from "next/headers";

export async function handleLogin(formData) {
  const cokie = await cookies();
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(data)
  console.log(`${api}authentication/login/`)

  const response = await fetch(`http://127.0.0.1:8000/api/authentication/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const new_data = await response.json();

  if (response.ok) {
    cokie.set("jwt", new_data.token, {
      httpOnly: false, // Prevent client-side access for security
      secure: false, // Use HTTPS in production
      sameSite: "Strict",
      path: "/",
    });
    redirect(`/`);
  } else {
    throw new Error("Wrong credentials");
  }
}

export async function LoginForm({
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your full name below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">name</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="findhacks@gmail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}