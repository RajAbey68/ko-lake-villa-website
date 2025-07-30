"use client"

import GlobalHeader from "@/components/navigation/global-header"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test the global header */}
      <GlobalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Navigation Test Page</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Navigation Breakpoint Testing</h2>
              <p className="text-gray-600 mb-4">
                Test the navigation at these breakpoints:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Mobile (320px):</strong> Navigation should collapse to hamburger menu</li>
                <li><strong>Small Mobile (375px):</strong> Logo should adjust size, compact layout</li>
                <li><strong>Tablet (768px):</strong> Desktop navigation should appear, adequate spacing</li>
                <li><strong>Desktop (1024px):</strong> Full navigation with contact info on large screens</li>
                <li><strong>Large Desktop (1440px+):</strong> Maximum spacing and contact information visible</li>
              </ul>
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Current Viewport Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-sm text-gray-500">Current breakpoint</div>
                  <div className="font-mono text-lg">
                    <span className="sm:hidden">xs (&lt;640px)</span>
                    <span className="hidden sm:inline md:hidden">sm (640px+)</span>
                    <span className="hidden md:inline lg:hidden">md (768px+)</span>
                    <span className="hidden lg:inline xl:hidden">lg (1024px+)</span>
                    <span className="hidden xl:inline 2xl:hidden">xl (1280px+)</span>
                    <span className="hidden 2xl:inline">2xl (1536px+)</span>
                  </div>
                </div>
                
                <div className="bg-blue-100 p-4 rounded">
                  <div className="text-sm text-gray-500">Navigation State</div>
                  <div className="font-mono text-lg">
                    <span className="lg:hidden">Mobile</span>
                    <span className="hidden lg:inline">Desktop</span>
                  </div>
                </div>
                
                <div className="bg-green-100 p-4 rounded">
                  <div className="text-sm text-gray-500">Contact Info</div>
                  <div className="font-mono text-lg">
                    <span className="xl:hidden">Hidden</span>
                    <span className="hidden xl:inline">Visible</span>
                  </div>
                </div>
                
                <div className="bg-orange-100 p-4 rounded">
                  <div className="text-sm text-gray-500">Book Now Button</div>
                  <div className="font-mono text-lg">
                    <span className="sm:hidden">Hidden</span>
                    <span className="hidden sm:inline">Visible</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Test Actions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Mobile Menu Test (on small screens)</h3>
                  <p className="text-gray-600 text-sm">
                    On mobile devices, click the hamburger menu to test mobile navigation functionality.
                    Verify that menu items are properly spaced and accessible.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Hover States</h3>
                  <p className="text-gray-600 text-sm">
                    Hover over navigation links to test transition effects and color changes.
                    Active states should be clearly visible.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Resize Testing</h3>
                  <p className="text-gray-600 text-sm">
                    Resize your browser window to test responsive behavior at different breakpoints.
                    Navigation should adapt smoothly without overlapping or spacing issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
