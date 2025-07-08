import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ABnBLinksProps {
  links: {
    id: string;
    title: string;
    url: string;
    description?: string;
  }[];
}

export default function ABnBLinks({ links }: ABnBLinksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link) => (
        <Button
          key={link.id}
          variant="outline"
          className="abnb-link h-auto p-4 flex flex-col items-start gap-2 hover:bg-[#FF5A5F] hover:text-white transition-all"
          data-abnb-link
          data-url={link.url}
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 w-full">
            <ExternalLink className="w-4 h-4" />
            <span className="font-medium">{link.title}</span>
          </div>
          {link.description && (
            <span className="text-sm opacity-75 text-left">
              {link.description}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}