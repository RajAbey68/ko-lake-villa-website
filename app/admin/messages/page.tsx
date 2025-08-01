"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  MessageCircle, Mail, Phone, Calendar, User, Check, X, Trash2, 
  Eye, Filter, Search, RefreshCw, Clock, CheckCircle, XCircle,
  AlertCircle, MessageSquare, Users, TrendingUp
} from "lucide-react"
import { db } from '@/lib/firebase'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  where,
  Timestamp 
} from 'firebase/firestore'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  submittedAt: Timestamp | null
  status: 'open' | 'closed'
  closedAt: Timestamp | null
  closedBy: string | null
  emailSent: boolean
  emailMessageId: string | null
  emailSentAt: Timestamp | null
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [showClosedMessages, setShowClosedMessages] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Load messages from Firebase
  useEffect(() => {
    if (!db) {
      console.warn('Firebase not initialized')
      setLoading(false)
      return
    }

    const messagesQuery = query(
      collection(db, 'contactMessages'),
      orderBy('submittedAt', 'desc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData: ContactMessage[] = []
      snapshot.forEach((doc) => {
        messageData.push({
          id: doc.id,
          ...doc.data()
        } as ContactMessage)
      })
      setMessages(messageData)
      setLoading(false)
    }, (error) => {
      console.error('Error loading messages:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Filter messages based on search and status
  useEffect(() => {
    let filtered = messages

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter)
    }

    // Hide closed messages if toggle is off
    if (!showClosedMessages) {
      filtered = filtered.filter(msg => msg.status === 'open')
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMessages(filtered)
  }, [messages, searchTerm, statusFilter, showClosedMessages])

  const handleCloseMessage = async (messageId: string) => {
    if (!db) return

    setActionLoading(messageId)
    try {
      await updateDoc(doc(db, 'contactMessages', messageId), {
        status: 'closed',
        closedAt: serverTimestamp(),
        closedBy: 'Admin' // You could get this from auth context
      })
    } catch (error) {
      console.error('Error closing message:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReopenMessage = async (messageId: string) => {
    if (!db) return

    setActionLoading(messageId)
    try {
      await updateDoc(doc(db, 'contactMessages', messageId), {
        status: 'open',
        closedAt: null,
        closedBy: null
      })
    } catch (error) {
      console.error('Error reopening message:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!db || !confirm('Are you sure you want to delete this message? This action cannot be undone.')) return

    setActionLoading(messageId)
    try {
      await deleteDoc(doc(db, 'contactMessages', messageId))
      setSelectedMessage(null)
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'N/A'
    return timestamp.toDate().toLocaleString()
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return <Badge className="bg-green-100 text-green-800">Open</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
  }

  const openMessages = messages.filter(msg => msg.status === 'open')
  const closedMessages = messages.filter(msg => msg.status === 'closed')
  const emailSentCount = messages.filter(msg => msg.emailSent).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Loading messages...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800">Contact Messages</h1>
        <p className="mt-2 text-gray-600">
          Manage and respond to contact form submissions from your website
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Messages</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{openMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Messages</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{closedMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{emailSentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, subject, or message..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'open' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('open')}
              >
                Open
              </Button>
              <Button
                variant={statusFilter === 'closed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('closed')}
              >
                Closed
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowClosedMessages(!showClosedMessages)}
              >
                {showClosedMessages ? 'Hide' : 'Show'} Closed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Contact messages will appear here when submitted.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold">{message.name}</h3>
                      {getStatusBadge(message.status)}
                      {message.emailSent && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Mail className="w-3 h-3 mr-1" />
                          Email Sent
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${message.email}`} className="hover:text-amber-700">
                          {message.email}
                        </a>
                      </div>
                      {message.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${message.phone}`} className="hover:text-amber-700">
                            {message.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(message.submittedAt)}
                      </div>
                      {message.status === 'closed' && message.closedAt && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Closed: {formatDate(message.closedAt)}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <p className="font-medium text-gray-900 mb-1">
                        Subject: {message.subject}
                      </p>
                      <p className="text-gray-700">
                        {truncateText(message.message)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Contact Message Details</DialogTitle>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Name</Label>
                                <p className="text-sm text-gray-700">{selectedMessage.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm text-gray-700">
                                  <a href={`mailto:${selectedMessage.email}`} className="hover:text-amber-700">
                                    {selectedMessage.email}
                                  </a>
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Phone</Label>
                                <p className="text-sm text-gray-700">{selectedMessage.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Subject</Label>
                                <p className="text-sm text-gray-700">{selectedMessage.subject}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="mt-1">
                                  {getStatusBadge(selectedMessage.status)}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Submitted</Label>
                                <p className="text-sm text-gray-700">{formatDate(selectedMessage.submittedAt)}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Message</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>
                            </div>
                            
                            {selectedMessage.status === 'closed' && selectedMessage.closedAt && (
                              <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-600">
                                  <strong>Closed:</strong> {formatDate(selectedMessage.closedAt)} by {selectedMessage.closedBy}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex justify-between pt-4">
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                disabled={actionLoading === selectedMessage.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Message
                              </Button>
                              
                              {selectedMessage.status === 'open' ? (
                                <Button
                                  onClick={() => handleCloseMessage(selectedMessage.id)}
                                  disabled={actionLoading === selectedMessage.id}
                                  className="bg-amber-600 hover:bg-amber-700"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark as Closed
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleReopenMessage(selectedMessage.id)}
                                  disabled={actionLoading === selectedMessage.id}
                                  variant="outline"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reopen Message
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {message.status === 'open' ? (
                      <Button
                        size="sm"
                        onClick={() => handleCloseMessage(message.id)}
                        disabled={actionLoading === message.id}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {actionLoading === message.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReopenMessage(message.id)}
                        disabled={actionLoading === message.id}
                      >
                        {actionLoading === message.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 