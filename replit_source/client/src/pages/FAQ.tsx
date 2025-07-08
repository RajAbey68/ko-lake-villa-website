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

  const [showDetailedRules, setShowDetailedRules] = useState(false);

  const funTopics = [
    {
      question: "🏊‍♂️ Can I live my best poolside life?",
      answer: "Absolutely! Dive in, float around, sip cocktails by the water, and soak up those Sri Lankan vibes. The pool is your playground from 6:00 AM to 10:00 PM. Just keep an eye on the little ones and remember - safety first, fun second!"
    },
    {
      question: "🎉 How wild can our celebrations get?",
      answer: "We love a good party! Dance, laugh, toast to life, and make memories that'll last forever. Just keep the volume neighborly after 10:30 PM so everyone can enjoy the magic. Want to throw a bigger bash? Let's chat and make it epic!"
    },
    {
      question: "🍹 What's the drink situation like?",
      answer: "Pour freely and enjoy! Whether you're mixing tropical cocktails, sharing wine under the stars, or trying our chef's local recommendations - this is your time to indulge. We can even help with storage and prep for your favorite libations!"
    },
    {
      question: "🌿 Can I embrace the jungle paradise vibes?",
      answer: "You're in a stunning jungle-lake paradise! Monkeys might say hello, exotic birds will serenade you, and geckos are your friendly roommates. It's nature's entertainment system - just don't feed the wildlife and keep doors closed when you're out exploring."
    },
    {
      question: "👨‍🍳 How good is the food scene here?",
      answer: "Get ready for a culinary adventure! Our chef creates amazing Sri Lankan and international dishes that'll blow your mind. Love cooking? Bring your own favorites too - we're here to help with whatever makes your taste buds happy!"
    }
  ];

  const detailedRules = `Welcome to Ko Lake! We want you to feel free, at ease, and fully able to enjoy this stunning part of Sri Lanka. To keep the good vibes flowing for everyone — guests, staff, and our neighbours — here are a few simple guidelines:

⸻

1. Respect Each Other
This is your home during your stay. Treat it — and those in it — with kindness and care. Harassment, threatening behaviour, or lewd conduct will not be tolerated. Anyone crossing the line may be asked to leave without a refund.

2. Safety Comes First
Play, swim, dance, drink — but stay safe. Be mindful around the pool, fire, and sharp edges. Please watch children at all times. If something breaks, let us know — no judgement, just honesty.

3. Be Good to the Villa
This space has been crafted with love. Don't rearrange or remove furniture. If something is out of place, we'll happily help.

4. Illicit Substances
Drugs and illegal substances are a no-go. If it becomes an issue, we'll need to involve local authorities. We'll always cooperate fully if asked to.

5. Noise & Nightlife
Have fun — just be mindful of your surroundings. We encourage good music, great company, and the occasional late night — as long as it doesn't disturb other guests or the village. After 10:30 PM, please keep things low-key.

6. Visitors & Gatherings
Friends are welcome — but large groups or parties need to be discussed with us first. Respect the space and those sharing it.

7. Food & Drink
We'd love you to try our chef's creations — but you're free to bring your own favourites too. Just let us know ahead, especially for storage or preparation help.

8. Staff & Privacy
Our team is here to help. Please treat them with warmth and courtesy. They have clear working hours and private spaces — please respect those boundaries.

9. Damage & Repairs
Things happen. If something gets damaged, just tell us. We'll sort it quickly and fairly.

10. Wildlife & Nature
You're in a jungle-lake paradise. Monkeys, birds, geckos, and other visitors might pop in. Don't feed them, and don't leave food out. Keep doors and windows closed when away.

⸻

Thank You
These guidelines aren't here to limit you — they're here to protect what makes Ko Lake special.

Now kick off your shoes, pour something cold, and enjoy the serenity.
Relax, Revive, and Connect — you're in the right place.`;

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#1E4E5F] to-[#2A5A6B]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Have Some Fun! 🌴
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Welcome to Ko Lake Villa - where good vibes flow and memories are made! Kick off your shoes, pour something cold, and get ready to enjoy paradise. Here's everything you need to know to make the most of your stay.
            </p>
          </div>
        </div>
      </section>

      {/* Fun Guidelines Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-[#1E4E5F] mb-6 text-center">
                🎉 Your Guide to Paradise Living
              </h2>
              <div className="text-center mb-8">
                <p className="text-lg text-[#333333] mb-6">
                  We're all about good vibes, great times, and unforgettable memories. Here's the simple version: 
                  <strong> Relax, Revive, and Connect</strong> - you're in the right place!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">🕐 Check-in/out:</span> 2PM / 11AM
                  </div>
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">🎵 Party hours:</span> Until 10:30 PM
                  </div>
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">🏊‍♂️ Pool time:</span> 6AM - 10PM
                  </div>
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">👫 Friends welcome:</span> Just let us know
                  </div>
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">🍷 Drinks & food:</span> we try to oblige!
                  </div>
                  <div className="bg-[#F8F6F2] p-4 rounded-lg">
                    <span className="font-semibold text-[#1E4E5F]">🐒 Wildlife:</span> Don't feed them
                  </div>
                </div>
                <div className="mt-8">
                  <Button 
                    onClick={() => setShowDetailedRules(!showDetailedRules)}
                    className="bg-[#E8B87D] hover:bg-[#1E4E5F] text-white font-medium px-8 py-3 text-lg transition-colors"
                  >
                    {showDetailedRules ? 'Hide' : 'Show'} Detailed Villa Guidelines
                  </Button>
                </div>
                {showDetailedRules && (
                  <div className="mt-8 bg-[#F8F6F2] rounded-lg p-6 text-left">
                    <pre className="whitespace-pre-wrap text-sm text-[#333333] font-sans leading-relaxed">
                      {detailedRules}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1E4E5F] mb-8 text-center">
              The Fun Stuff You Really Want to Know! 🌟
            </h2>
            <div className="space-y-6">
              {funTopics.map((item, index) => (
                <div key={index} className="bg-[#F8F6F2] rounded-lg p-6 border border-[#E6D9C7] hover:shadow-lg transition-shadow">
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
          
          {/* Clear FAQ Button */}
          <div className="mt-6 text-center">
            <Button 
              id="faq-clear"
              variant="outline" 
              className="text-gray-600 hover:text-gray-800"
              type="button"
            >
              Clear All Fields
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;