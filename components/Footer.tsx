import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#8B5E3C] py-12 text-[#FDF6EE]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">Ko Lake Villa</h3>
            <p className="mb-4">A boutique lakeside retreat offering luxury accommodation and personalized experiences.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF914D]" aria-label="Facebook">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF914D]" aria-label="Instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF914D]" aria-label="Tripadvisor">
                <i className="fab fa-tripadvisor text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#FF914D]">Home</Link></li>
              <li><Link href="/accommodation" className="hover:text-[#FF914D]">Accommodation</Link></li>
              <li><Link href="/dining" className="hover:text-[#FF914D]">Dining</Link></li>
              <li><Link href="/gallery" className="hover:text-[#FF914D]">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF914D]">Contact</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 w-4"></i>
                <span>Madolduwa Road, Kathaluwa West, Ahangama, Sri Lanka</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3"></i>
                <span>+94 711730345</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <span>kolakevilla@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Placeholder for Newsletter */}
          <div>
             <h4 className="font-display text-xl font-bold mb-4">Newsletter</h4>
             <p>Subscribe for updates and special offers.</p>
             {/* TODO: Implement newsletter form */}
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Ko Lake Villa. All rights reserved.</p>
          {/* Floating WhatsApp Button */}
          <a href="https://wa.me/94711730345" target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50">
            <i className="fab fa-whatsapp text-2xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
} 