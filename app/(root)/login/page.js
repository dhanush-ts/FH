import LoginForm from "@/components/auth/login-form" 

export const metadata = {
  title: "FindHacks | Login",
  description: "A powerful event management and AI health evaluation platform",
};

export default function Page() {
  return (
    <div className="flex overflow-hidden">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}