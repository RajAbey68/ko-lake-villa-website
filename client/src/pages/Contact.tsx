import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  timezone: z.string().default("Asia/Colombo"),
  familiarity: z.enum(["yes", "no"], { message: "Please select your familiarity with the region" }),
  messageType: z.enum(["message", "feedback", "testimonial"], { message: "Please select the type of message" }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  localMedia: z.any().optional()
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
      phone: '',
      timezone: 'Asia/Colombo',
      familiarity: undefined,
      messageType: undefined,
      subject: '',
      message: '',
      localMedia: undefined
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
      <section className="relative pt-32 pb-20 bg-[#8B5E3C]">
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
                  <p className="text-[#333333]">Ko Lake Villa, Mirissane Ovita<br />Madolduwa Road<br />Kathaluwa West<br />Ahangama<br />Galle, Southern District, Sri Lanka<br />80650</p>
                  <p className="text-[#666666] text-sm mt-2">Landmark: Koggala Lake Bridge, South Beach Resort Hotel</p>
                  <div className="mt-3 space-y-2">
                    <a 
                      href="https://maps.app.goo.gl/6tDbt8o3Ph2SHrH89" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block bg-[#1E4E5F] hover:bg-[#2A5F72] text-white px-4 py-2 rounded-full text-sm transition-colors mr-2"
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i> View on Google Maps
                    </a>
                    <a 
                      href="https://w3w.co/surfer.loiterers.serenely" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block bg-[#E11F26] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-full text-sm transition-colors"
                    >
                      <i className="fas fa-location-dot mr-2"></i> what3words
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#FF914D] text-2xl">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#8B5E3C] mb-1">Phone</h4>
                  <p className="text-[#333333]">+94 071 173 0345</p>
                  <a 
                    href="tel:+940711730345" 
                    className="inline-block mt-2 bg-[#FF914D] hover:bg-[#8B5E3C] text-white px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    <i className="fas fa-phone-alt mr-2"></i> Call Now
                  </a>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#FF914D] text-2xl">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#8B5E3C] mb-1">WhatsApp</h4>
                  <p className="text-[#333333]">+94 071 173 0345</p>
                  <a 
                    href="https://wa.me/940711730345" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    <i className="fab fa-whatsapp mr-2"></i> Chat on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-[#FF914D] text-2xl">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#8B5E3C] mb-1">Email</h4>
                  <p className="text-[#333333]">contact@KoLakeHouse.com</p>
                  <a 
                    href="mailto:contact@KoLakeHouse.com" 
                    className="inline-block mt-2 bg-[#62C3D2] hover:bg-[#8B5E3C] text-white px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    <i className="fas fa-envelope mr-2"></i> Send Email
                  </a>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-[#8B5E3C] mb-4">Follow Us</h4>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.facebook.com/KoLaClubSriLanka/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#1877F2] text-white hover:bg-[#166FE5] px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-instagram mr-2"></i>
                    <span>Instagram</span>
                  </a>
                  <a 
                    href="https://tripadvisor.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#34E0A1] text-white hover:bg-[#00AF63] px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-tripadvisor mr-2"></i>
                    <span>TripAdvisor</span>
                  </a>
                </div>
                
                <div className="mt-6 bg-[#FDF6EE] p-4 rounded-lg border border-[#A0B985] shadow-sm">
                  <h4 className="font-bold text-[#8B5E3C] mb-2">Book Direct Benefits</h4>
                  <ul className="text-[#333333] space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Best rates guaranteed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Flexible cancellation policy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Personalized attention</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Special requests accommodated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-display font-bold text-[#1E4E5F] mb-6">Send us a message, Feedback or Testimonial we can use on our publicity</h2>
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Contact Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel" 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            placeholder="+94 71 123 4567" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]">
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Asia/Colombo">Sri Lanka (GMT+5:30)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                            <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                            <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                            <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                            <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                            <SelectItem value="Australia/Sydney">Sydney (GMT+11)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="familiarity"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[#333333]">Are you familiar with this region?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="familiar-yes" />
                              <Label htmlFor="familiar-yes" className="text-[#333333] cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="familiar-no" />
                              <Label htmlFor="familiar-no" className="text-[#333333] cursor-pointer">No</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="messageType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[#333333]">What type of message are you sending?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="message" id="type-message" />
                              <Label htmlFor="type-message" className="text-[#333333] cursor-pointer">General Message</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="feedback" id="type-feedback" />
                              <Label htmlFor="type-feedback" className="text-[#333333] cursor-pointer">Feedback</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="testimonial" id="type-testimonial" />
                              <Label htmlFor="type-testimonial" className="text-[#333333] cursor-pointer">Testimonial we can use on our publicity</Label>
                            </div>
                          </RadioGroup>
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
                  
                  <FormField
                    control={form.control}
                    name="localMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="localMedia" className="text-[#333333]">Upload a photo or video of your local area</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            id="localMedia" 
                            name="localMedia" 
                            accept="image/*,video/*" 
                            multiple 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E6D9C7] file:text-[#1E4E5F] hover:file:bg-[#D4C4A8]"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <small className="text-[#666666] text-sm">Supported formats: JPG, PNG, MP4</small>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15871.7866139131!2d80.32870271945636!3d5.991118726432507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae138d6811fe84b%3A0x1f97c4cc01fbac01!2sKo%20Lake%20House!5e0!3m2!1sen!2sus!4v1716319984086!5m2!1sen!2sus"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ko Lake House Location on Map"
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
