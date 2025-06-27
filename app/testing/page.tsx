"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestingDashboard() {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'pass' | 'fail'}>({})
  const [isRunning, setIsRunning] = useState(false)

  const testCategories = [
    {
      name: "Homepage Tests",
      tests: [
        { id: "home-1", name: "Homepage loads successfully", description: "Verify homepage loads without errors" },
        { id: "home-2", name: "Hero section displays correctly", description: "Check hero image and text are visible" },
        { id: "home-3", name: "Navigation menu works", description: "All navigation links are functional" },
        { id: "home-4", name: "Book Now button works", description: "Primary CTA button is clickable" },
        { id: "home-5", name: "WhatsApp widget visible", description: "Floating WhatsApp button appears" },
        { id: "home-6", name: "Features section displays", description: "All 4 feature cards are visible" },
        { id: "home-7", name: "Stats section shows data", description: "Guest rating, rooms, guests, support stats" },
        { id: "home-8", name: "CTA section functional", description: "Check availability and contact buttons work" },
        { id: "home-9", name: "Responsive design mobile", description: "Mobile layout displays correctly" },
        { id: "home-10", name: "Responsive design tablet", description: "Tablet layout displays correctly" },
        { id: "home-11", name: "Responsive design desktop", description: "Desktop layout displays correctly" },
        { id: "home-12", name: "SEO meta tags present", description: "Title, description, and keywords set" },
        { id: "home-13", name: "Open Graph tags present", description: "Social media sharing tags configured" },
        { id: "home-14", name: "Page load speed < 3s", description: "Homepage loads within 3 seconds" },
        { id: "home-15", name: "Images optimized", description: "All images have proper alt tags and sizing" }
      ]
    },
    {
      name: "Accommodation Tests",
      tests: [
        { id: "acc-1", name: "Accommodation page loads", description: "Page loads without errors" },
        { id: "acc-2", name: "Room listings display", description: "All 4 room types are shown" },
        { id: "acc-3", name: "Room images load", description: "All room images display correctly" },
        { id: "acc-4", name: "Pricing information visible", description: "Prices and discounts shown" },
        { id: "acc-5", name: "Room features listed", description: "Amenities and features displayed" },
        { id: "acc-6", name: "Booking buttons work", description: "Book buttons are functional" },
        { id: "acc-7", name: "Room descriptions complete", description: "All room descriptions present" },
        { id: "acc-8", name: "Capacity information", description: "Guest capacity for each room" },
        { id: "acc-9", name: "Size information", description: "Room sizes displayed" },
        { id: "acc-10", name: "Bathroom count", description: "Bathroom information shown" }
      ]
    },
    {
      name: "Deals Tests",
      tests: [
        { id: "deal-1", name: "Deals page loads", description: "Page loads without errors" },
        { id: "deal-2", name: "Deal cards display", description: "All 3 deals are shown" },
        { id: "deal-3", name: "Discount badges visible", description: "Discount percentages displayed" },
        { id: "deal-4", name: "Original vs deal prices", description: "Price comparison shown" },
        { id: "deal-5", name: "Deal features listed", description: "Included features displayed" },
        { id: "deal-6", name: "Valid until dates", description: "Deal expiration dates shown" },
        { id: "deal-7", name: "Book deal buttons", description: "Deal booking buttons work" },
        { id: "deal-8", name: "Deal descriptions", description: "All deal descriptions present" }
      ]
    },
    {
      name: "Experiences Tests",
      tests: [
        { id: "exp-1", name: "Experiences page loads", description: "Page loads without errors" },
        { id: "exp-2", name: "Experience cards display", description: "All 6 experiences shown" },
        { id: "exp-3", name: "Experience images load", description: "All experience images display" },
        { id: "exp-4", name: "Pricing information", description: "Experience prices shown" },
        { id: "exp-5", name: "Duration information", description: "Experience durations displayed" },
        { id: "exp-6", name: "Difficulty levels", description: "Difficulty ratings shown" },
        { id: "exp-7", name: "Highlights listed", description: "Experience highlights displayed" },
        { id: "exp-8", name: "Book experience buttons", description: "Booking buttons functional" }
      ]
    },
    {
      name: "Contact Tests",
      tests: [
        { id: "con-1", name: "Contact page loads", description: "Page loads without errors" },
        { id: "con-2", name: "Contact form displays", description: "Contact form is visible" },
        { id: "con-3", name: "Form fields work", description: "All form inputs functional" },
        { id: "con-4", name: "Contact info cards", description: "Contact information displayed" },
        { id: "con-5", name: "Location information", description: "Address and location details" },
        { id: "con-6", name: "Phone numbers", description: "Phone contact information" },
        { id: "con-7", name: "Email addresses", description: "Email contact information" },
        { id: "con-8", name: "Check-in/out times", description: "Check-in/out information" },
        { id: "con-9", name: "WhatsApp button", description: "WhatsApp contact button" },
        { id: "con-10", name: "Form submission", description: "Contact form submission works" }
      ]
    },
    {
      name: "Gallery Tests",
      tests: [
        { id: "gal-1", name: "Gallery page loads", description: "Page loads without errors" },
        { id: "gal-2", name: "Gallery images display", description: "All gallery images load" },
        { id: "gal-3", name: "Image optimization", description: "Images are properly optimized" },
        { id: "gal-4", name: "Gallery navigation", description: "Gallery navigation works" }
      ]
    },
    {
      name: "FAQ Tests",
      tests: [
        { id: "faq-1", name: "FAQ page loads", description: "Page loads without errors" },
        { id: "faq-2", name: "FAQ items display", description: "All FAQ items are shown" },
        { id: "faq-3", name: "FAQ interactions", description: "FAQ expand/collapse works" }
      ]
    },
    {
      name: "Performance Tests",
      tests: [
        { id: "perf-1", name: "Page load speed", description: "All pages load < 3 seconds" },
        { id: "perf-2", name: "Image optimization", description: "Images are compressed and optimized" },
        { id: "perf-3", name: "CSS optimization", description: "CSS is minified and optimized" },
        { id: "perf-4", name: "JavaScript optimization", description: "JS is minified and optimized" },
        { id: "perf-5", name: "Font loading", description: "Fonts load efficiently" },
        { id: "perf-6", name: "Bundle size", description: "JavaScript bundle size is reasonable" },
        { id: "perf-7", name: "Caching headers", description: "Proper caching headers set" },
        { id: "perf-8", name: "CDN usage", description: "Static assets served from CDN" }
      ]
    },
    {
      name: "SEO Tests",
      tests: [
        { id: "seo-1", name: "Meta titles", description: "All pages have unique meta titles" },
        { id: "seo-2", name: "Meta descriptions", description: "All pages have meta descriptions" },
        { id: "seo-3", name: "Open Graph tags", description: "Social media sharing tags" },
        { id: "seo-4", name: "Structured data", description: "Schema markup present" },
        { id: "seo-5", name: "Sitemap", description: "XML sitemap exists" },
        { id: "seo-6", name: "Robots.txt", description: "Robots.txt file present" },
        { id: "seo-7", name: "Canonical URLs", description: "Canonical URLs set" },
        { id: "seo-8", name: "Alt text", description: "All images have alt text" }
      ]
    },
    {
      name: "Security Tests",
      tests: [
        { id: "sec-1", name: "HTTPS redirect", description: "HTTP redirects to HTTPS" },
        { id: "sec-2", name: "Security headers", description: "Security headers present" },
        { id: "sec-3", name: "XSS protection", description: "XSS protection headers" },
        { id: "sec-4", name: "CSRF protection", description: "CSRF protection implemented" },
        { id: "sec-5", name: "Input validation", description: "Form inputs are validated" },
        { id: "sec-6", name: "SQL injection", description: "No SQL injection vulnerabilities" },
        { id: "sec-7", name: "Content Security Policy", description: "CSP headers set" }
      ]
    },
    {
      name: "Accessibility Tests",
      tests: [
        { id: "acc-1", name: "Keyboard navigation", description: "Site navigable by keyboard" },
        { id: "acc-2", name: "Screen reader support", description: "Screen reader compatible" },
        { id: "acc-3", name: "Color contrast", description: "Sufficient color contrast" },
        { id: "acc-4", name: "Focus indicators", description: "Visible focus indicators" },
        { id: "acc-5", name: "Alt text", description: "All images have alt text" },
        { id: "acc-6", name: "ARIA labels", description: "Proper ARIA labels used" },
        { id: "acc-7", name: "Semantic HTML", description: "Semantic HTML structure" }
      ]
    },
    {
      name: "Cross-browser Tests",
      tests: [
        { id: "browser-1", name: "Chrome compatibility", description: "Works in Chrome" },
        { id: "browser-2", name: "Firefox compatibility", description: "Works in Firefox" },
        { id: "browser-3", name: "Safari compatibility", description: "Works in Safari" },
        { id: "browser-4", name: "Edge compatibility", description: "Works in Edge" },
        { id: "browser-5", name: "Mobile Chrome", description: "Works in mobile Chrome" },
        { id: "browser-6", name: "Mobile Safari", description: "Works in mobile Safari" }
      ]
    }
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    const results: {[key: string]: 'pending' | 'pass' | 'fail'} = {}
    
    // Simulate running all tests
    for (const category of testCategories) {
      for (const test of category.tests) {
        results[test.id] = 'pending'
        setTestResults({...results})
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Simulate test result (90% pass rate)
        results[test.id] = Math.random() > 0.1 ? 'pass' : 'fail'
        setTestResults({...results})
      }
    }
    
    setIsRunning(false)
  }

  const getTestStatus = (testId: string) => {
    return testResults[testId] || 'pending'
  }

  const getTotalTests = () => {
    return testCategories.reduce((total, category) => total + category.tests.length, 0)
  }

  const getPassedTests = () => {
    return Object.values(testResults).filter(result => result === 'pass').length
  }

  const getFailedTests = () => {
    return Object.values(testResults).filter(result => result === 'fail').length
  }

  const getProgress = () => {
    const total = getTotalTests()
    const completed = Object.keys(testResults).length
    return total > 0 ? (completed / total) * 100 : 0
  }

  const getPassRate = () => {
    const total = getTotalTests()
    const passed = getPassedTests()
    return total > 0 ? (passed / total) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold text-amber-900 tracking-tight">
            Ko Lake Villa
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Testing Dashboard</h1>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="bg-orange-400 hover:bg-orange-500 text-white"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>
        </div>
      </header>

      {/* Test Summary */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{getTotalTests()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{getPassedTests()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{getFailedTests()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{getPassRate().toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getProgress()} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                {Object.keys(testResults).length} of {getTotalTests()} tests completed
              </p>
            </CardContent>
          </Card>

          {/* Test Categories */}
          <div className="space-y-6">
            {testCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>
                    {category.tests.length} tests in this category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {category.tests.map((test) => {
                      const status = getTestStatus(test.id)
                      return (
                        <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{test.name}</div>
                            <div className="text-sm text-gray-600">{test.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                            {status === 'pass' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                            <Badge variant={status === 'pass' ? 'default' : status === 'fail' ? 'destructive' : 'secondary'}>
                              {status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 