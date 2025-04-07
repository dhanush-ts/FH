import SignUp from "@/components/auth/sign-up";

export const metadata = {
  title: "FindHacks | Sign Up",
  description: "A powerful event management and AI health evaluation platform",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignUp />
    </div>
  );
}