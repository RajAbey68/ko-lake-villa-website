import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Download, Eye, Trash2, Calendar, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ContentDocument } from "@shared/schema";

export default function Documents() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "",
    targetTribes: [] as string[],
  });
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery<ContentDocument[]>({
    queryKey: ["/api/documents"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setSelectedFile(null);
      setUploadForm({ title: "", category: "", targetTribes: [] });
      toast({
        title: "Document uploaded successfully",
        description: "AI analysis will be completed shortly",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document deleted successfully" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm(prev => ({ ...prev, title: file.name.split(".")[0] }));
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadForm.title || !uploadForm.category) {
      toast({
        title: "Missing information",
        description: "Please select a file, enter a title, and choose a category",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("title", uploadForm.title);
    formData.append("category", uploadForm.category);
    formData.append("targetTribes", JSON.stringify(uploadForm.targetTribes));

    uploadMutation.mutate(formData);
  };

  const toggleTribe = (tribe: string) => {
    setUploadForm(prev => ({
      ...prev,
      targetTribes: prev.targetTribes.includes(tribe)
        ? prev.targetTribes.filter(t => t !== tribe)
        : [...prev.targetTribes, tribe]
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      marketing: "bg-blue-100 text-blue-800",
      news: "bg-green-100 text-green-800",
      events: "bg-purple-100 text-purple-800",
      seo: "bg-orange-100 text-orange-800",
      content: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      "cultural-events": "bg-pink-100 text-pink-800",
      "cricket-events": "bg-emerald-100 text-emerald-800",
      "surfing-events": "bg-cyan-100 text-cyan-800",
    };
    return colors[eventType as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Documents</h1>
        <div className="text-sm text-muted-foreground">
          Upload marketing materials, news, and event information
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="mt-1"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Tribes</Label>
              <div className="flex gap-2 mt-1">
                {["leisure", "digital-nomads", "experienced-tourers"].map((tribe) => (
                  <Button
                    key={tribe}
                    variant={uploadForm.targetTribes.includes(tribe) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTribe(tribe)}
                  >
                    {tribe.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploadMutation.isPending || !selectedFile}
            className="w-full"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload & Analyze"}
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </CardContent>
          </Card>
        ) : documents && documents.length > 0 ? (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <h3 className="font-semibold">{doc.title}</h3>
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                      {doc.seoScore > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {doc.seoScore}% SEO
                        </Badge>
                      )}
                    </div>

                    {doc.aiSummary && (
                      <p className="text-sm text-muted-foreground">{doc.aiSummary}</p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {doc.targetTribes?.map((tribe) => (
                        <Badge key={tribe} variant="secondary" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {tribe.replace("-", " ")}
                        </Badge>
                      ))}
                      {doc.eventTypes?.map((eventType) => (
                        <Badge key={eventType} className={`text-xs ${getEventTypeColor(eventType)}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {eventType.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>

                    {doc.extractedKeywords && (
                      <div className="text-xs text-muted-foreground">
                        Keywords: {doc.extractedKeywords.split(",").slice(0, 5).join(", ")}
                        {doc.extractedKeywords.split(",").length > 5 && "..."}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Uploaded: {new Date(doc.createdAt).toLocaleDateString()} • 
                      Size: {Math.round(doc.fileSize / 1024)} KB • 
                      Type: {doc.fileType}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = doc.fileUrl;
                        a.download = doc.fileName;
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload marketing materials, news updates, or event information to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}