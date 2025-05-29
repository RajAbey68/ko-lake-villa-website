import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react';
import { Link } from 'wouter';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  bookingDetails: {
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    amount: number;
    nights: number;
  };
}

const CheckoutForm = ({ bookingDetails }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-confirmation`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed! You'll receive an email confirmation shortly.",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF914D]" />
            Booking Summary
          </CardTitle>
          <CardDescription>Ko Lake Villa - Direct Booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Room:</span>
              <span className="font-medium">{bookingDetails.roomName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium">{bookingDetails.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nights:</span>
              <span className="font-medium">{bookingDetails.nights}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-[#FF914D]">${bookingDetails.amount}</span>
            </div>
          </div>

          {/* Direct Booking Benefits */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Direct Booking Benefits</h4>
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Best rate guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>No booking fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Direct support from Ko Lake Villa</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Flexible cancellation policy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF914D]" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Your payment is secured by Stripe. We never store your card details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement 
              options={{
                layout: "tabs"
              }}
            />
            
            <Button 
              type="submit" 
              disabled={!stripe || isProcessing}
              className="w-full bg-[#FF914D] hover:bg-[#e67e3d] text-white py-3"
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing Payment...
                </div>
              ) : (
                `Complete Booking - $${bookingDetails.amount}`
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-3 h-3" />
                <span>Secured by Stripe</span>
              </div>
              <p>
                By completing this booking, you agree to Ko Lake Villa's terms and conditions.
                Your payment will be processed securely through Stripe.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // First check session storage for booking data from "Book Direct" buttons
    const stored = sessionStorage.getItem('bookingData');
    let details;
    
    if (stored) {
      details = JSON.parse(stored);
      // Clear session storage after retrieving
      sessionStorage.removeItem('bookingData');
    } else {
      // Fallback to URL params
      const params = new URLSearchParams(window.location.search);
      const roomName = params.get('room') || 'Entire Villa Exclusive (KNP)';
      const checkIn = params.get('checkin') || new Date().toISOString().split('T')[0];
      const checkOut = params.get('checkout') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const guests = parseInt(params.get('guests') || '2');
      const amount = parseInt(params.get('amount') || '350');
      
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      
      details = {
        roomName,
        checkIn,
        checkOut,
        guests,
        amount,
        nights
      };
    }
    
    setBookingDetails(details);

    // Create payment intent
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: details.amount,
      booking: details 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Payment setup error:', error);
        toast({
          title: "Payment Setup Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, []);

  if (loading || !clientSecret || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF914D] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Preparing your booking...</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#FF914D',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/accommodation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#8B5E3C]">Complete Your Booking</h1>
            <p className="text-gray-600">Ko Lake Villa - Secure Direct Booking</p>
          </div>
        </div>

        {/* Checkout Form */}
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm bookingDetails={bookingDetails} />
        </Elements>
      </div>
    </div>
  );
}