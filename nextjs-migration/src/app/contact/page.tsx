import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Ko Lake Villa',
  description: 'Get in touch with Ko Lake Villa for bookings, inquiries, and more information about our luxury accommodation.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">Koggala Lake, Sri Lanka</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">info@kolakevilla.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+94 XXX XXX XXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}