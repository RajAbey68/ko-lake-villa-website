import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ko Lake Villa</h3>
            <p className="text-gray-300">
              Luxury accommodation by the serene Koggala Lake in southern Sri Lanka.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/accommodation" className="block text-gray-300 hover:text-white">
                Accommodation
              </Link>
              <Link href="/gallery" className="block text-gray-300 hover:text-white">
                Gallery
              </Link>
              <Link href="/experiences" className="block text-gray-300 hover:text-white">
                Experiences
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>Koggala Lake, Sri Lanka</p>
              <p>info@kolakevilla.com</p>
              <p>+94 XXX XXX XXX</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Ko Lake Villa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}