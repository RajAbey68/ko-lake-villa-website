import { useState } from 'react';
import { Link } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Schema for newsletter subscription form
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const Footer = () => {
  const { toast } = useToast();
  const [subscribing, setSubscribing] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    setSubscribing(true);
    try {
      await apiRequest('POST', '/api/newsletter', values);
      toast({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter."
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1E4E5F] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 whitespace-nowrap">Ko Lake Villa</h3>
            <p className="mb-6">A boutique lakeside retreat offering luxury accommodation and personalized experiences in a serene natural setting.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E8B87D] transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E8B87D] transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E8B87D] transition-colors" aria-label="Tripadvisor">
                <i className="fab fa-tripadvisor text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#E8B87D] transition-colors">Home</Link></li>
              <li><Link href="/accommodation" className="hover:text-[#E8B87D] transition-colors">Accommodation</Link></li>
              <li><Link href="/dining" className="hover:text-[#E8B87D] transition-colors">Dining & Services</Link></li>
              <li><Link href="/experiences" className="hover:text-[#E8B87D] transition-colors">Activities & Experiences</Link></li>
              <li><Link href="/gallery" className="hover:text-[#E8B87D] transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-[#E8B87D] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Contact Information</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>Ko Lake Villa, Lake Road, Koggala Lake, Sri Lanka</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3"></i>
                <span>+94 071 173 0345</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <span>contact@KoLakeHouse.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Newsletter</h4>
            <p className="mb-4">Subscribe to receive updates, special offers, and travel inspiration.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your Email Address" 
                          className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-[#E8B87D] text-white placeholder:text-white placeholder:opacity-70"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={subscribing}
                  className="bg-[#E8B87D] text-white px-4 py-2 rounded hover:bg-white hover:text-[#1E4E5F] transition-colors font-medium"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Ko Lake Villa. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-[#E8B87D] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#E8B87D] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
