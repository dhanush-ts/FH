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
      <div className="pb-36 from-gray-50 to-gray-100">
        {children}
        <Toaster />
      </div>
    </AuthGuard>
  );
}
