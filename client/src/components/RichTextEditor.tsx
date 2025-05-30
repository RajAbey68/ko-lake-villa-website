import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, Link, Image, Upload } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [urlText, setUrlText] = useState('');
  const [urlHref, setUrlHref] = useState('');

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertBulletPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Check if we're at the start of a line or need a new line
    const needsNewLine = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
    const bullet = (needsNewLine ? '\n' : '') + '• ';
    
    const newText = beforeCursor + bullet + afterCursor;
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + bullet.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertLink = () => {
    if (urlText && urlHref) {
      const linkMarkdown = `[${urlText}](${urlHref})`;
      insertText(linkMarkdown);
      setShowUrlDialog(false);
      setUrlText('');
      setUrlHref('');
    }
  };

  const formatPreview = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    
    return text
      // Convert markdown links to HTML
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')
      // Convert **bold** to HTML (non-greedy match)
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to HTML (avoid matching bold markers)
      .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
      // Convert bullet points to list items
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      // Wrap consecutive list items in ul tags
      .replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="list-disc list-inside space-y-1">$1</ul>')
      // Convert line breaks to HTML
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('**', '**', 'bold text')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('*', '*', 'italic text')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertBulletPoint}
          title="Bullet Point"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowUrlDialog(true)}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-32 font-mono text-sm"
      />

      {/* Preview */}
      {value && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Preview:</label>
          <div 
            className="p-3 border rounded-lg bg-gray-50 min-h-16"
            dangerouslySetInnerHTML={{ __html: formatPreview(value) }}
          />
        </div>
      )}

      {/* URL Dialog */}
      {showUrlDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">Insert Link</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Text:</label>
              <input
                type="text"
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder="Click here"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL:</label>
              <input
                type="url"
                value={urlHref}
                onChange={(e) => setUrlHref(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUrlDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={insertLink}
                disabled={!urlText || !urlHref}
              >
                Insert Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}