'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit2, Trash2, Target, Sparkles, Eye, Save, Copy, Download, Upload } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  targetAudience: string
  campaignText: string
  keywords: string[]
  tone: 'luxury' | 'family' | 'wellness' | 'adventure' | 'business' | 'romantic'
  isActive: boolean
  createdAt: string
  lastModified: string
  usageCount: number
}

interface SEOPreview {
  altText: string
  seoTitle: string
  seoDescription: string
  suggestedTags: string[]
  confidence: number
}

const CAMPAIGN_TEMPLATES = {
  wellness: {
    name: 'Wellness & Retreat Travelers',
    description: 'Target guests seeking relaxation, mindfulness, and wellness experiences',
    targetAudience: 'Wellness travelers, yoga enthusiasts, meditation practitioners',
    campaignText: `Target wellness travelers and yoga enthusiasts seeking luxury eco-retreat experiences in Sri Lanka. 
    
Emphasize our tranquil lakefront location, peaceful environment, and holistic wellness opportunities. Highlight meditation spaces, yoga-friendly areas, sustainable practices, and mindful luxury amenities. 

Focus on themes of: renewal, balance, mindfulness, nature connection, digital detox, stress relief, and authentic wellness experiences. 

Mention our serene Koggala Lake setting, natural surroundings, and peaceful atmosphere that promotes relaxation and inner peace.`,
    keywords: ['wellness', 'retreat', 'mindfulness', 'yoga', 'meditation', 'tranquil', 'peaceful', 'sustainable', 'nature', 'balance'],
    tone: 'wellness' as const
  },
  family: {
    name: 'Family & Group Travelers',
    description: 'Target families seeking safe, comfortable, and memorable experiences',
    targetAudience: 'Families with children, multi-generational groups, family reunions',
    campaignText: `Target families and groups seeking safe, spacious, and comfortable luxury accommodation in Sri Lanka.

Emphasize our family-friendly amenities, child safety features, spacious accommodations, and group activity options. Highlight our secure environment, reliable services, and dedicated family spaces.

Focus on themes of: creating memories together, multi-generational comfort, child-friendly luxury, group bonding experiences, safety and security, convenience for families.

Mention our villa's capacity for families, kitchen facilities, multiple bedrooms, and safe lakefront environment perfect for children and grandparents alike.`,
    keywords: ['family', 'safe', 'spacious', 'children', 'group', 'secure', 'comfortable', 'convenient', 'memories', 'generations'],
    tone: 'family' as const
  },
  nomad: {
    name: 'Digital Nomads & Remote Workers',
    description: 'Target remote workers seeking productive and inspiring work environments',
    targetAudience: 'Digital nomads, remote workers, freelancers, entrepreneurs',
    campaignText: `Target digital nomads and remote workers seeking reliable internet, peaceful work environments, and inspiring productivity spaces in Sri Lanka.

Emphasize our high-speed internet, dedicated workspace areas, quiet environment, and escape-to-productivity amenities. Highlight our lakefront inspiration, reliable power, and professional-friendly atmosphere.

Focus on themes of: productivity, reliable connectivity, inspiring work environment, work-life balance, creative inspiration, professional comfort, and digital nomad lifestyle.

Mention our lake views that inspire creativity, quiet spaces for calls, reliable infrastructure, and peaceful setting that enhances focus and productivity.`,
    keywords: ['remote work', 'digital nomad', 'productivity', 'internet', 'workspace', 'quiet', 'inspiration', 'focus', 'professional', 'connectivity'],
    tone: 'business' as const
  },
  luxury: {
    name: 'Luxury Experience Seekers',
    description: 'Target high-end travelers seeking premium experiences and service',
    targetAudience: 'Luxury travelers, high-end tourists, premium experience seekers',
    campaignText: `Target luxury travelers seeking premium accommodation experiences and exceptional service in Sri Lanka.

Emphasize our boutique luxury amenities, personalized service, exclusive lakefront location, and sophisticated comfort. Highlight our attention to detail, premium facilities, and curated luxury experiences.

Focus on themes of: exclusivity, sophistication, premium quality, personalized service, unique experiences, refined luxury, and exceptional hospitality.

Mention our exclusive Koggala Lake location, premium furnishings, personalized concierge service, and sophisticated amenities that deliver an unparalleled luxury experience.`,
    keywords: ['luxury', 'premium', 'exclusive', 'sophisticated', 'boutique', 'personalized', 'exceptional', 'refined', 'curated', 'unparalleled'],
    tone: 'luxury' as const
  },
  adventure: {
    name: 'Adventure & Cultural Explorers',
    description: 'Target adventurous travelers seeking authentic Sri Lankan experiences',
    targetAudience: 'Adventure travelers, cultural explorers, experience seekers',
    campaignText: `Target adventure travelers and cultural explorers seeking authentic Sri Lankan experiences and local adventures.

Emphasize our strategic location for exploring Sri Lanka's attractions, cultural sites, and adventure activities. Highlight our local knowledge, excursion coordination, and authentic cultural experiences.

Focus on themes of: authentic exploration, local culture, adventure activities, Sri Lankan heritage, natural wonders, cultural immersion, and memorable experiences.

Mention our proximity to Galle Fort, whale watching, cultural sites, and our ability to arrange authentic local experiences and adventure activities.`,
    keywords: ['adventure', 'cultural', 'authentic', 'exploration', 'local', 'heritage', 'experiences', 'excursions', 'activities', 'Sri Lankan'],
    tone: 'adventure' as const
  },
  romantic: {
    name: 'Romantic & Couples Retreats',
    description: 'Target couples seeking romantic and intimate experiences',
    targetAudience: 'Couples, honeymooners, anniversary celebrants, romantic getaways',
    campaignText: `Target couples and romantic travelers seeking intimate, private, and romantic experiences in Sri Lanka.

Emphasize our romantic lakefront setting, intimate atmosphere, privacy, and couple-focused amenities. Highlight our sunset views, private spaces, and romantic dining options.

Focus on themes of: romance, intimacy, privacy, sunset moments, couple time, romantic luxury, peaceful togetherness, and memorable romantic experiences.

Mention our stunning lake views, private villa setting, romantic sunset opportunities, and intimate atmosphere perfect for couples seeking connection and romance.`,
    keywords: ['romantic', 'couples', 'intimate', 'private', 'sunset', 'honeymoon', 'anniversary', 'togetherness', 'connection', 'peaceful'],
    tone: 'romantic' as const
  }
}

export default function CampaignGenerator() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [seoPreview, setSeoPreview] = useState<SEOPreview | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('campaigns')
  const { toast } = useToast()

  // Load campaigns from localStorage
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('kolake-campaigns')
    if (savedCampaigns) {
      try {
        const parsed = JSON.parse(savedCampaigns)
        setCampaigns(parsed)
      } catch (error) {
        console.error('Error loading campaigns:', error)
      }
    }
  }, [])

  // Save campaigns to localStorage
  const saveCampaigns = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns)
    localStorage.setItem('kolake-campaigns', JSON.stringify(updatedCampaigns))
  }

  const createCampaignFromTemplate = (templateKey: string) => {
    const template = CAMPAIGN_TEMPLATES[templateKey as keyof typeof CAMPAIGN_TEMPLATES]
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      targetAudience: template.targetAudience,
      campaignText: template.campaignText,
      keywords: template.keywords,
      tone: template.tone,
      isActive: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0
    }
    
    const updatedCampaigns = [...campaigns, newCampaign]
    saveCampaigns(updatedCampaigns)
    setSelectedCampaign(newCampaign)
    setEditingCampaign(newCampaign)
    setIsCreateDialogOpen(true)
    
    toast({
      title: "Campaign Template Created",
      description: `${template.name} campaign template has been created. You can now customize it.`,
    })
  }

  const createCustomCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: 'Custom Campaign',
      description: 'Custom campaign description',
      targetAudience: 'Target audience',
      campaignText: '',
      keywords: [],
      tone: 'luxury',
      isActive: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0
    }
    
    setEditingCampaign(newCampaign)
    setIsCreateDialogOpen(true)
  }

  const saveCampaign = (campaign: Campaign) => {
    const updatedCampaign = {
      ...campaign,
      lastModified: new Date().toISOString()
    }
    
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id)
    let updatedCampaigns
    
    if (existingIndex >= 0) {
      updatedCampaigns = [...campaigns]
      updatedCampaigns[existingIndex] = updatedCampaign
    } else {
      updatedCampaigns = [...campaigns, updatedCampaign]
    }
    
    saveCampaigns(updatedCampaigns)
    setIsCreateDialogOpen(false)
    setEditingCampaign(null)
    
    toast({
      title: "Campaign Saved",
      description: `${campaign.name} has been saved successfully.`,
    })
  }

  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId)
    saveCampaigns(updatedCampaigns)
    
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null)
    }
    
    toast({
      title: "Campaign Deleted",
      description: "Campaign has been deleted successfully.",
    })
  }

  const toggleCampaignActive = (campaignId: string) => {
    const updatedCampaigns = campaigns.map(c => ({
      ...c,
      isActive: c.id === campaignId ? !c.isActive : (c.isActive && c.id !== campaignId ? false : c.isActive)
    }))
    saveCampaigns(updatedCampaigns)
    
    toast({
      title: "Campaign Status Updated",
      description: "Campaign activation status has been updated.",
    })
  }

  const generateSEOPreview = async (campaign: Campaign) => {
    setIsGeneratingPreview(true)
    try {
      const response = await fetch('/api/gallery/ai-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: '/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
          currentTitle: 'Pool Deck Area',
          currentDescription: 'Beautiful pool deck with lake views',
          category: 'pool-deck',
          campaignText: campaign.campaignText
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate SEO preview')
      }

      const data = await response.json()
      setSeoPreview(data)
      setIsPreviewDialogOpen(true)
    } catch (error) {
      console.error('Error generating SEO preview:', error)
      toast({
        title: "Preview Generation Failed",
        description: "Could not generate SEO preview. Please check your OpenAI configuration.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const exportCampaigns = () => {
    const dataStr = JSON.stringify(campaigns, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `kolake-campaigns-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Campaigns Exported",
      description: "Campaign data has been exported successfully.",
    })
  }

  const importCampaigns = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedCampaigns = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedCampaigns)) {
          const mergedCampaigns = [...campaigns, ...importedCampaigns]
          saveCampaigns(mergedCampaigns)
          toast({
            title: "Campaigns Imported",
            description: `${importedCampaigns.length} campaigns have been imported successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import campaigns. Please check the file format.",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const duplicateCampaign = (campaign: Campaign) => {
    const duplicated: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      isActive: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0
    }
    
    const updatedCampaigns = [...campaigns, duplicated]
    saveCampaigns(updatedCampaigns)
    
    toast({
      title: "Campaign Duplicated",
      description: `${campaign.name} has been duplicated successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaign & SEO Strategy Manager</h2>
          <p className="text-gray-600">Create and manage campaign strategies to influence AI-generated SEO content</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportCampaigns} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept=".json" 
              onChange={importCampaigns}
              className="hidden"
            />
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </label>
          <Button onClick={createCustomCampaign}>
            <Plus className="w-4 h-4 mr-2" />
            Create Custom
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Campaign Templates</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <div className="grid gap-4">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
                    <p className="text-gray-600 mb-4">Create your first campaign to start influencing SEO generation</p>
                    <Button onClick={createCustomCampaign}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id} className={`${campaign.isActive ? 'border-amber-500 bg-amber-50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {campaign.name}
                          {campaign.isActive && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              Active
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {campaign.tone}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{campaign.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateSEOPreview(campaign)}
                          disabled={isGeneratingPreview}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateCampaign(campaign)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCampaign(campaign)
                            setIsCreateDialogOpen(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Target Audience</Label>
                        <p className="text-sm text-gray-600">{campaign.targetAudience}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Keywords</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {campaign.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Campaign Text Preview</Label>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {campaign.campaignText.substring(0, 200)}...
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Used {campaign.usageCount} times • Modified {new Date(campaign.lastModified).toLocaleDateString()}
                        </div>
                        <Button
                          variant={campaign.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleCampaignActive(campaign.id)}
                        >
                          {campaign.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(CAMPAIGN_TEMPLATES).map(([key, template]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Target Audience</Label>
                      <p className="text-sm text-gray-600">{template.targetAudience}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.keywords.slice(0, 6).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {template.keywords.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.keywords.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-3">
                      <Button 
                        onClick={() => createCampaignFromTemplate(key)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create from Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Usage Analytics</CardTitle>
                <CardDescription>Track how your campaigns are performing</CardDescription>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No campaigns created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .map((campaign) => (
                        <div key={campaign.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-gray-600">
                              {campaign.tone} • {campaign.keywords.length} keywords
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{campaign.usageCount} uses</div>
                            <div className="text-sm text-gray-600">
                              {campaign.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Creation/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign?.id ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
            <DialogDescription>
              Configure your campaign strategy to influence AI-generated SEO content
            </DialogDescription>
          </DialogHeader>
          
          {editingCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={editingCampaign.name}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="tone">Campaign Tone</Label>
                  <Select
                    value={editingCampaign.tone}
                    onValueChange={(value) => setEditingCampaign({ ...editingCampaign, tone: value as Campaign['tone'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Campaign Description</Label>
                <Input
                  id="description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  placeholder="Brief description of the campaign"
                />
              </div>
              
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={editingCampaign.targetAudience}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, targetAudience: e.target.value })}
                  placeholder="Who is this campaign targeting?"
                />
              </div>
              
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={editingCampaign.keywords.join(', ')}
                  onChange={(e) => setEditingCampaign({ 
                    ...editingCampaign, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                  })}
                  placeholder="luxury, wellness, family, adventure, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="campaignText">Campaign Text (500 words max)</Label>
                <Textarea
                  id="campaignText"
                  value={editingCampaign.campaignText}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, campaignText: e.target.value })}
                  placeholder="Detailed campaign strategy and messaging guidelines..."
                  className="min-h-[200px]"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {editingCampaign.campaignText.length} / 500 words
                </div>
              </div>
              
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  This campaign text will be used to bias AI-generated content toward your target audience. 
                  Be specific about tone, themes, and messaging you want to emphasize.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => saveCampaign(editingCampaign)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Campaign
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SEO Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>SEO Preview</DialogTitle>
            <DialogDescription>
              See how this campaign influences AI-generated SEO content
            </DialogDescription>
          </DialogHeader>
          
          {seoPreview && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Alt Text</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                  {seoPreview.altText}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">SEO Title</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                  {seoPreview.seoTitle}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">SEO Description</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                  {seoPreview.seoDescription}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Suggested Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {seoPreview.suggestedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Confidence Score</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-gray-200 rounded-full h-2 flex-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${seoPreview.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(seoPreview.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
