import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export function TagCategoryHint() {
  return (
    <Alert className="mb-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Tag-Category Consistency</AlertTitle>
      <AlertDescription>
        This system ensures tags are automatically generated based on the selected category. 
        When you choose a category, relevant tags are created to maintain consistency across 
        your Ko Lake Villa gallery. The AI analysis feature can also suggest appropriate 
        categories and tags for your villa images.
      </AlertDescription>
    </Alert>
  );
}