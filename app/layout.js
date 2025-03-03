import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Adjust as needed
});

export const metadata = {
  title: "Find Hacks",
  description: "Fink Hacks | your hackathon searching destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
