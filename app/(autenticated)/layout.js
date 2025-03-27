
import "../globals.css";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Find Hacks",
  description: "Fink Hacks | your hackathon searching destination",
};

export default async function RootLayout({ children }) {

  return (
      <div>
        {children}
        <Toaster />
      </div>
  );
}