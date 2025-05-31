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

// Schema for special request form
const specialRequestSchema = z.object({
  checkin: z.string().min(1, { message: "Check-in date is required" }),
  checkout: z.string().min(1, { message: "Check-out date is required" }),
  people: z.string().min(1, { message: "Number of people is required" }),
  notes: z.string().optional()
});

type SpecialRequestValues = z.infer<typeof specialRequestSchema>;

const FAQ = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [calculatedNights, setCalculatedNights] = useState<number>(0);

  useEffect(() => {
    document.title = "FAQ & House Rules - Ko Lake Villa";
  }, []);

  const form = useForm<SpecialRequestValues>({
    resolver: zodResolver(specialRequestSchema),
    defaultValues: {
      checkin: '',
      checkout: '',
      people: '',
      notes: ''
    }
  });

  // Function to calculate nights between check-in and check-out dates
  const calculateNights = (checkinDate: string, checkoutDate: string) => {
    if (!checkinDate || !checkoutDate) {
      setCalculatedNights(0);
      return;
    }
    
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    
    if (checkout <= checkin) {
      setCalculatedNights(0);
      return;
    }
    
    const timeDifference = checkout.getTime() - checkin.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
    setCalculatedNights(nights);
  };

  const onSubmit = async (values: SpecialRequestValues) => {
    setSubmitting(true);
    try {
      await apiRequest('POST', '/api/special-request', {
        ...values,
        nights: calculatedNights
      });
      toast({
        title: "Request submitted successfully!",
        description: "We'll get back to you within 24 hours."
      });
      form.reset();
      setCalculatedNights(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "What are the check-in and check-out times?",
      answer: "Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request and subject to availability."
    },
    {
      question: "Is smoking allowed on the property?",
      answer: "Smoking is not permitted indoors anywhere on the property. Designated outdoor smoking areas are available."
    },
    {
      question: "What are the quiet hours?",
      answer: "We maintain quiet hours from 10:00 PM to 8:00 AM to ensure all guests can enjoy a peaceful stay."
    },
    {
      question: "Can I bring guests who are not staying overnight?",
      answer: "Outside guests must be pre-approved by management. Please contact us in advance to arrange day visits."
    },
    {
      question: "Are pets allowed?",
      answer: "Pets are allowed on request. Please inform us during booking about any pets you plan to bring so we can prepare accordingly."
    },
    {
      question: "What if something gets damaged during my stay?",
      answer: "Please report any breakages or damages immediately to our staff. We appreciate your honesty and will handle repairs promptly."
    },
    {
      question: "Is the pool safe to use?",
      answer: "The pool is available for guest use at your own risk. Children must be supervised at all times. Pool hours are 6:00 AM to 10:00 PM."
    },
    {
      question: "What amenities are included?",
      answer: "All rooms include air conditioning, Wi-Fi, private bathrooms, and daily housekeeping. Common areas include the pool, garden, and shared kitchen facilities."
    },
    {
      question: "Is Wi-Fi available throughout the property?",
      answer: "Yes, complimentary high-speed Wi-Fi is available throughout the villa and all outdoor areas."
    },
    {
      question: "Can you arrange transportation from the airport?",
      answer: "Yes, we can arrange airport transfers for an additional fee. Please contact us at least 24 hours before your arrival."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#1E4E5F] to-[#2A5A6B]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Everything you need to know about your stay at Ko Lake Villa
            </p>
          </div>
        </div>
      </section>

      {/* House Rules Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-[#1E4E5F] mb-6 flex items-center">
                🏠 Rules of the House
              </h2>
              <div className="prose prose-lg max-w-none text-[#333333]">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Check-in: 2:00 PM | Check-out: 11:00 AM
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    No smoking indoors
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Respect quiet hours after 10:00 PM
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Outside guests must be pre-approved
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Pets allowed on request
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Breakages must be reported
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-[#1E4E5F] mr-2">•</span>
                    Use of pool at own risk
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1E4E5F] mb-8 text-center">
              Common Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-[#F8F6F2] rounded-lg p-6 border border-[#E6D9C7]">
                  <h3 className="text-xl font-semibold text-[#1E4E5F] mb-3">
                    {item.question}
                  </h3>
                  <p className="text-[#333333] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Request Form */}
      <section className="py-16 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1E4E5F] mb-6 text-center">
                Submit a Special Request
              </h2>
              <p className="text-[#666666] text-center mb-8">
                Have specific needs? Let us know about dietary requirements, mobility assistance, or event setup needs.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="checkin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">Check-in Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date" 
                              className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                              required
                              onChange={(e) => {
                                field.onChange(e);
                                calculateNights(e.target.value, form.getValues('checkout'));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="checkout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">Check-out Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date" 
                              className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                              required
                              onChange={(e) => {
                                field.onChange(e);
                                calculateNights(form.getValues('checkin'), e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {calculatedNights > 0 && (
                    <div className="bg-[#E8F4F8] border border-[#B3D9E6] rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <span className="text-[#1E4E5F] font-semibold text-lg">
                          Duration: {calculatedNights} night{calculatedNights !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="people"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Number of People</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            placeholder="How many guests?"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Other Notes (Dietary / Mobility / Event setup)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            rows={4} 
                            placeholder="Let us know your needs..."
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
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;