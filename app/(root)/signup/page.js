import GoogleSignUp from "@/components/auth/google-signup";
import SignUp from "@/components/auth/sign-up";
import OptimizedLottie from "@/components/ui/display-lottie";
import Link from "next/link";

export const metadata = {
  title: "FindHacks | Sign Up",
  description: "A powerful event management and AI health evaluation platform",
};

export default function SignUpPage() {
  return (
    <div className="min-w-screen min-h-screen bg-gray-50 flex items-center justify-center px-5 py-5 mb-8 md:mb-12">
      <div
        className="bg-white text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 bg-green-100 py-10 px-10">
          <OptimizedLottie
              animationData={require("@/app/assests/floatingPerson.json")}
              loop={true}
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <SignUp />
            <div className="flex items-center my-3 px-3">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex item-center mx-auto">
              <div className="w-full px-3 mx-auto">
                <GoogleSignUp />
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="text-green-500 hover:text-green-600 underline underline-offset-4">
                Sign up
              </Link>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}