import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Room } from '@shared/schema';

// Helper function to check date conflicts with real bookings
const isDateRangeAvailable = (checkIn: string, checkOut: string, bookings: any[] = []) => {
  const requestedCheckIn = new Date(checkIn);
  const requestedCheckOut = new Date(checkOut);
  
  for (const booking of bookings) {
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);
    
    // Check if dates overlap
    if (requestedCheckIn < bookingCheckOut && requestedCheckOut > bookingCheckIn) {
      return false;
    }
  }
  return true;
};

// Schema for booking form validation
const bookingFormSchema = z.object({
  checkInDate: z.string().min(1, { message: "Check-in date is required" }),
  checkOutDate: z.string().min(1, { message: "Check-out date is required" }),
  guests: z.string().min(1, { message: "Number of guests is required" }),
  roomType: z.string().min(1, { message: "Room type is required" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  specialRequests: z.string().optional()
}).refine(data => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"]
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const Booking = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch rooms for the room type dropdown
  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  // Fetch real booking data from SirVoy for KLV1 (Master Family Suite)
  const { data: klv1Bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/sirvoy/bookings'],
    queryFn: async () => {
      const response = await fetch('/api/sirvoy/bookings?icalUrl=https%3A//secured.sirvoy.com/ical/ba9904a2-aa48-4a1b-a3c4-26d65bf93790');
      return response.json();
    }
  });

  useEffect(() => {
    document.title = "Book Your Stay - Ko Lake Villa";
  }, []);

  // Get tomorrow's date for min check-in date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get check-out min date based on check-in date
  const getCheckOutMinDate = (checkInDate: string) => {
    if (!checkInDate) return getTomorrow();
    
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      guests: '',
      roomType: '',
      name: '',
      email: '',
      specialRequests: ''
    }
  });

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitting(true);
    try {
      // Check availability against real SirVoy data for KLV1
      if (values.roomType === 'klv1' && klv1Bookings?.bookings) {
        const isAvailable = isDateRangeAvailable(
          values.checkInDate, 
          values.checkOutDate, 
          klv1Bookings.bookings
        );
        
        if (!isAvailable) {
          toast({
            title: "Dates Not Available",
            description: "The Master Family Suite is already booked for these dates. Please select different dates.",
            variant: "destructive"
          });
          setSubmitting(false);
          return;
        }
      }

      await apiRequest('POST', '/api/booking', values);
      toast({
        title: "Booking request submitted!",
        description: "We'll get back to you within 24 hours to confirm your booking.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Booking request failed",
        description: "There was a problem submitting your booking request. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate min checkout date whenever check-in date changes
  const checkInDate = form.watch('checkInDate');
  const checkOutMinDate = getCheckOutMinDate(checkInDate);

  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]" role="banner">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Book Your Stay</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Ready to experience the serenity of Ko Lake Villa? Check availability and request a booking below.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Date */}
                  <FormField
                    control={form.control}
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Check-in Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            min={getTomorrow()}
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Check-out Date */}
                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Check-out Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            min={checkOutMinDate}
                            disabled={!checkInDate}
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Guests */}
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Number of Guests</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]">
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4 Guests</SelectItem>
                            <SelectItem value="5">5 Guests</SelectItem>
                            <SelectItem value="6+">6+ Guests</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Real-time Availability Status */}
                  {klv1Bookings?.bookings && klv1Bookings.bookings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-800 mb-2">Current Bookings - Master Family Suite</h4>
                      <div className="space-y-1 text-sm text-amber-700">
                        {klv1Bookings.bookings.map((booking: any, index: number) => (
                          <div key={index}>
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()} (Unavailable)
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-amber-600 mt-2">These dates are not available for the Master Family Suite</p>
                    </div>
                  )}

                  {/* Room Type */}
                  <FormField
                    control={form.control}
                    name="roomType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Room Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]">
                              <SelectValue placeholder="Select a room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomsLoading ? (
                              <SelectItem value="loading">Loading rooms...</SelectItem>
                            ) : (
                              rooms?.map((room) => (
                                <SelectItem key={room.id} value={room.name}>{room.name}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Full Name</FormLabel>
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

                  {/* Email Address */}
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

                  {/* Special Requests */}
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel className="text-[#333333]">Special Requests</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="border-[#E6D9C7] focus:border-[#1E4E5F] focus:ring-[#1E4E5F]" 
                            rows={4}
                            placeholder="Any special requirements or requests for your stay..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-center pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-[#E8B87D] hover:bg-[#1E4E5F] text-white px-8 py-3 rounded font-medium transition-colors"
                  >
                    {submitting ? "Submitting..." : "Check Availability"}
                  </Button>
                  <p className="text-sm text-[#333333] mt-4">Our team will respond to your inquiry within 24 hours.</p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Why Book With Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Why Book With Us</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Experience the many benefits of booking directly with Ko Lake Villa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="text-center p-6 bg-[#F8F6F2] rounded-lg">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-percentage"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Best Rate Guarantee</h3>
              <p className="text-[#333333]">We offer the best rates when you book directly with us, guaranteed.</p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-6 bg-[#F8F6F2] rounded-lg">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-cocktail"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Complimentary Welcome Drink</h3>
              <p className="text-[#333333]">Enjoy a refreshing welcome drink upon arrival when you book directly.</p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-6 bg-[#F8F6F2] rounded-lg">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-concierge-bell"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Personalized Service</h3>
              <p className="text-[#333333]">Direct bookings allow us to better understand and cater to your specific needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#E6D9C7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Booking FAQ</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Find answers to common questions about booking your stay at Ko Lake Villa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">What is your cancellation policy?</h3>
              <p className="text-[#333333]">Cancellations made 14 days or more before the check-in date will receive a full refund. Cancellations made 7-13 days before will receive a 50% refund. Cancellations made less than 7 days before the check-in date are non-refundable.</p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Is a deposit required?</h3>
              <p className="text-[#333333]">Yes, a 30% deposit is required to secure your booking. The remaining balance is due 14 days before your arrival date or can be paid upon check-in.</p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Can I modify my booking after confirmation?</h3>
              <p className="text-[#333333]">Yes, subject to availability. Please contact us as soon as possible if you need to make changes to your booking dates or room type.</p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">How far in advance should I book?</h3>
              <p className="text-[#333333]">We recommend booking at least 1-2 months in advance, especially during peak season (December-March). For holiday periods and special occasions, 3-6 months advance booking is advisable.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
