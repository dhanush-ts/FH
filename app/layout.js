import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./providers"; 
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalRouterProvider from "@/components/providers/global-router";
import SmoothScrollWrapper from "@/components/ui/LenisScrollWrap";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add more if needed
  variable: '--font-poppins', // Optional: For CSS variable usage
  display: 'swap',
});

export const metadata = {
  title: "FindHacks",
  description: "A powerful event management and AI health evaluation platform",
  icons: { icon: "/green.ico" },
  keywords: [
    "hackathon platform",
    "hackathons",
    "events",
    "symposiums",
    "find hackathons",
    "FindHacks",
  ],
};

export default function RootLayout({ children }) {
  const CLIENT_ID = "803976634382-ffm3v2818gk5kqoj5q39i5944dtmna39.apps.googleusercontent.com";
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <AuthProvider suppressHydrationWarning>
          <SmoothScrollWrapper>
              <Header />
                <GlobalRouterProvider />  
                <Toaster />
                 {children}
                <Footer />
            </SmoothScrollWrapper>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}