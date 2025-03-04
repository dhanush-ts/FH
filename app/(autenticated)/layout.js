import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Find Hacks",
  description: "Fink Hacks | your hackathon searching destination",
};

export default function RootLayout({ children }) {
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