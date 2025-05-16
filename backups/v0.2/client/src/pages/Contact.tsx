import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact Us - Ko Lake Villa";
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', values);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible."
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Have questions or need assistance? Reach out to our team through your preferred method of communication.
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information Box */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-display font-bold text-[#1E4E5F] mb-6">Get in Touch</h2>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#E8B87D] text-2xl">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#1E4E5F] mb-1">Location</h4>
                  <p className="text-[#333333]">Ko Lake Villa, Lake Road, Koggala Lake, Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#E8B87D] text-2xl">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#1E4E5F] mb-1">Phone</h4>
                  <p className="text-[#333333]">+94 071 173 0345</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#E8B87D] text-2xl">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#1E4E5F] mb-1">WhatsApp</h4>
                  <p className="text-[#333333]">+94 071 173 0345</p>
                  <a 
                    href="https://wa.me/940711730345" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#E8B87D] hover:text-[#1E4E5F] transition-colors"
                  >
                    Message us on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 text-[#E8B87D] text-2xl">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#1E4E5F] mb-1">Email</h4>
                  <p className="text-[#333333]">contact@KoLakeHouse.com</p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-[#1E4E5F] mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#E6D9C7] text-[#1E4E5F] hover:bg-[#E8B87D] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#E6D9C7] text-[#1E4E5F] hover:bg-[#E8B87D] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a 
                    href="https://tripadvisor.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#E6D9C7] text-[#1E4E5F] hover:bg-[#E8B87D] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-tripadvisor"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-display font-bold text-[#1E4E5F] mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            placeholder="John Doe" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            placeholder="your@email.com" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Subject</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            placeholder="Booking Inquiry" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            rows={5} 
                            placeholder="Your message here..." 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#E8B87D] hover:bg-[#1E4E5F] text-white font-medium transition-colors"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15871.901510053566!2d80.31662!3d5.9834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae138f67ca93103%3A0x8f84b3dfe2f0b192!2sKoggala%20Lake!5e0!3m2!1sen!2sus!4v1667915125020!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ko Lake Villa Location on Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Find answers to common questions about Ko Lake Villa. If you don't see your question here, please contact us directly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">What are your check-in and check-out times?</h3>
              <p className="text-[#333333]">Check-in is from 2:00 PM, and check-out is by 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability.</p>
            </div>

            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Is airport transfer available?</h3>
              <p className="text-[#333333]">Yes, we can arrange airport transfers at an additional cost. Please contact us with your flight details to organize this service.</p>
            </div>

            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Do you have Wi-Fi available?</h3>
              <p className="text-[#333333]">Yes, complimentary high-speed Wi-Fi is available throughout the property.</p>
            </div>

            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Can I book the entire villa?</h3>
              <p className="text-[#333333]">Yes, you can book the entire villa for exclusive use. This is perfect for family gatherings, friend reunions, or small retreats. Please contact us for availability and rates.</p>
            </div>

            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">What payment methods do you accept?</h3>
              <p className="text-[#333333]">We accept major credit cards, bank transfers, and cash payments in local currency or USD. A deposit is required to secure your booking.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
