// New client component for authentication
import AuthGuard from "@/components/providers/auth-guard";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Profile | Portfolio",
  description: "A powerful event management and AI health evaluation platform",
};

export default function AuthLayout({ children }) {
  return (
    <AuthGuard>
      <div>
        {children}
        <Toaster />
      </div>
    </AuthGuard>
  );
}
