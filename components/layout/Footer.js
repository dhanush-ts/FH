import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-br from-emerald-800 to-green-900 text-white">
      {/* Wave SVG at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform translate-y-[-98%]">
        <svg
          className="relative block w-full h-[40px] md:h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-emerald-800"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Quote and Email */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">This is your chance, grab the opportunity!.</h3>
              <p className="text-emerald-200">hello@findhacks.com</p>
            </div>
          </div>

          {/* Right Column - Navigation and Social Links */}
          <div className="grid grid-cols-2 gap-8">

            <div className="space-y-3">
                <p>Find hackathons</p>
                <p>Host hackathons</p>
            </div>

            {/* Social Media Links - Stacked vertically */}
            <div className="flex flex-col items-start space-y-3">
              <Link href="https://instagram.com" className="flex items-center hover:text-emerald-300 transition-colors">
                <Instagram className="mr-2 h-5 w-5" />
                <span>Instagram</span>
              </Link>
              <Link href="https://linkedin.com" className="flex items-center hover:text-emerald-300 transition-colors">
                <Linkedin className="mr-2 h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section with Copyright and Terms */}
        <div className="mt-12 pt-6 border-t border-emerald-700/50 flex flex-row justify-between items-center">
          <div className="text-sm text-emerald-200 mb-4 md:mb-0">
            Chennai, Tamil Nadu
            <br />
            India
          </div>

          <div className="text-sm text-emerald-200">
            All rights reserved 2025
          </div>
        </div>

        {/* Brand Name */}
        <div className="mt-12 text-center -mb-2">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter opacity-90">FINDHACKS</h2>
        </div>
      </div>
    </footer>
  )
}

