'use client'

import { Suspense } from 'react'
import CampaignGenerator from '@/components/admin/campaign-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Sparkles } from 'lucide-react'

export default function CampaignsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign & SEO Strategy Manager</h1>
            <p className="text-gray-600 mt-1">
              Create and manage marketing campaigns that influence AI-generated SEO content across your website
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-amber-600" />
                Campaign Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Pre-built campaign strategies for different target audiences: wellness travelers, families, digital nomads, luxury seekers, and more.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
                AI SEO Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Campaign strategies automatically influence OpenAI-generated alt text, SEO titles, and descriptions to match your target audience messaging.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-amber-600" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track campaign performance and usage statistics to optimize your marketing strategy and content generation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      }>
        <CampaignGenerator />
      </Suspense>
    </div>
  )
} 