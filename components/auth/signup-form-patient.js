"use server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

async function handleSignUp(formData) {
  "use server";
  const data = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number"),
    password: formData.get("password"),
  };

  const response = await fetchWithAuth(`/auth/create-patient/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok){
    toast.success("Account created successfully. You can now log in.");
    redirect("/login");
  }
  else {
    toast.error(response.statusText);
  }
}

export async function SignUpPatient({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to create a patient account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" type="text" placeholder="Allwin" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="aswin@gmail.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" type="text" placeholder="000000000" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Changeme@123" required />
              </div>
              <Button type="submit" className="w-full">Sign Up</Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}