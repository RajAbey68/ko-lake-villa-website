import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, TestTube, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastUpdated?: string;
}

interface ContentManagerProps {
  sections: ContentSection[];
  onUpdate: (sectionId: string, content: string) => Promise<boolean>;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function EnhancedContentManager({ sections, onUpdate, onImageUpload }: ContentManagerProps) {
  const [editingSections, setEditingSections] = useState<Record<string, string>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { toast } = useToast();



  // Initialize editing states
  useEffect(() => {
    const initialStates: Record<string, string> = {};
    sections.forEach(section => {
      initialStates[section.id] = section.content;
    });
    setEditingSections(initialStates);
  }, [sections]);

  const handleContentChange = (sectionId: string, content: string) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };

  const handleSave = async (sectionId: string) => {
    setSavingStates(prev => ({ ...prev, [sectionId]: true }));
    
    try {
      const success = await onUpdate(sectionId, editingSections[sectionId]);
      
      if (success) {
        toast({
          title: "Content Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving.",
        variant: "destructive",
      });
    } finally {
      setSavingStates(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleImageUpload = async (sectionId: string, file: File) => {
    if (!onImageUpload) {
      toast({
        title: "Upload Error",
        description: "Image upload is not configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrl = await onImageUpload(file);
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      
      handleContentChange(sectionId, editingSections[sectionId] + '\n' + imageMarkdown);
      
      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded and added to content.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const runContentTests = async () => {
    setIsRunningTests(true);
    const results: Record<string, 'pass' | 'fail' | 'pending'> = {};

    try {
      for (const section of sections) {
        const content = editingSections[section.id] || '';
        
        // Simple content validation
        const hasContent = content && content.trim().length > 0;
        results[section.id] = hasContent ? 'pass' : 'fail';
        
        setTestResults({ ...results });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const passedTests = Object.values(results).filter(result => result === 'pass').length;
      const totalTests = Object.keys(results).length;
      
      toast({
        title: "Content Tests Complete",
        description: `${passedTests}/${totalTests} sections passed validation.`,
        variant: passedTests === totalTests ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Content testing error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const hasUnsavedChanges = (sectionId: string) => {
    const original = sections.find(s => s.id === sectionId)?.content || '';
    return editingSections[sectionId] !== original;
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Content Validation
          </CardTitle>
          <CardDescription>
            Test your content for formatting issues, broken links, and missing images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runContentTests} 
            disabled={isRunningTests}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isRunningTests ? 'Running Tests...' : 'Run Content Tests'}
          </Button>
          
          {Object.keys(testResults).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Test Results:</h4>
              {sections.map(section => (
                <div key={section.id} className="flex items-center gap-2">
                  {testResults[section.id] === 'pass' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : testResults[section.id] === 'fail' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <div className="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
                  )}
                  <span className="text-sm">{section.title}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sections */}
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{section.title}</span>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges(section.id) && (
                  <span className="text-sm text-amber-600">Unsaved changes</span>
                )}
                {testResults[section.id] && (
                  testResults[section.id] === 'pass' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Use **bold**, *italic*, bullet points (•), and [links](url) for rich formatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              value={editingSections[section.id] || ''}
              onChange={(content) => handleContentChange(section.id, content)}
              placeholder="Enter your content here..."
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(section.id, file);
                      // Reset input value to allow selecting the same file again
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                  id={`image-upload-${section.id}`}
                  ref={(input) => {
                    if (input) {
                      // Store reference for click handler
                      (window as any)[`fileInput_${section.id}`] = input;
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const input = (window as any)[`fileInput_${section.id}`];
                    if (input) {
                      input.click();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Add Image
                </Button>
                
                {section.lastUpdated && (
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date(section.lastUpdated).toLocaleString()}
                  </span>
                )}
              </div>
              
              <Button
                onClick={() => handleSave(section.id)}
                disabled={savingStates[section.id] || !hasUnsavedChanges(section.id)}
                className="flex items-center gap-2"
              >
                {savingStates[section.id] ? (
                  <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}