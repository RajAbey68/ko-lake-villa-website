import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackendStatus } from "@/components/backend-status"
import { Wrench, Clock, CheckCircle, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Main Maintenance Card */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Ko Lake Villa - System Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-lg">
              We're currently updating our backend systems to serve you better. The website continues to work, and you
              can still explore our beautiful villa!
            </p>

            {/* Status Updates */}
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Website Online</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Gallery Available</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Backend Updating</span>
              </div>
            </div>

            {/* What's Working */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ What's Working:</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Browse our beautiful villa gallery</li>
                <li>• View room types and pricing</li>
                <li>• Contact us directly via phone/WhatsApp</li>
                <li>• Explore accommodation options</li>
              </ul>
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <a href="https://wa.me/94123456789" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+94123456789">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:kolakevilla@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>

            {/* Continue Browsing */}
            <div className="pt-4 border-t">
              <p className="text-gray-600 mb-4">Continue exploring Ko Lake Villa:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/accommodation">Rooms</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/gallery">Gallery</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Status */}
        <BackendStatus />

        {/* ETA */}
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">
              <Clock className="w-4 h-4 inline mr-1" />
              Backend updates typically complete within 30-60 minutes.
              <br />
              <strong>No action required</strong> - everything will resume automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
