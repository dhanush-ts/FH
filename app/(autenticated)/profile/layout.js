import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Profile | Portfolio",
  description: "A powerful event management and AI health evaluation platform",
};

export default function AuthLayout({ children }) {
  return (
    <section>
      <div className="from-gray-50 to-gray-100 pb-36">
        {children}
      </div>
    </section>
  );
}