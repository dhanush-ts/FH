
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Find Hacks",
  description: "Fink Hacks | your hackathon searching destination",
};

export default async function RootLayout({ children }) {
  const cookie = await cookies();
  const jwt = cookie.get("jwt")?.value;
  if(!jwt){
    console.log(jwt);
    redirect("/")
  }
  return (
    <html lang="en">
      <body style={{fontFamily: 'Poppins'}} className={`font-poppins antialiased`}>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}