import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Shield, Check, Info } from 'lucide-react';
import { Link } from 'wouter';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CardValidationFormProps {
  bookingDetails: {
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
}

const CardValidationForm = ({ bookingDetails }: CardValidationFormProps) => {
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

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-confirmed`,
      },
    });

    if (error) {
      toast({
        title: "Card Validation Failed",
        description: error.message || "Unable to validate your payment method",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Card Validated Successfully",
        description: "Your booking is confirmed! We've validated your payment method without charging your card.",
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
          </div>

          {/* Payment Policy */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Payment Validation Policy
            </h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• We validate your payment method to secure your booking</p>
              <p>• <strong>No charge</strong> will be made to your card today</p>
              <p>• Payment will be collected according to our payment schedule</p>
              <p>• Your card details are securely stored by Stripe (PCI compliant)</p>
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

      {/* Card Validation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF914D]" />
            Validate Payment Method
          </CardTitle>
          <CardDescription>
            We'll validate your card to secure your booking. No charge will be made today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Card Validation Only</p>
                  <p>We will verify your payment method but will not charge your card. 
                     Payment will be collected according to our standard booking terms.</p>
                </div>
              </div>
            </div>

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
                  Validating Card...
                </div>
              ) : (
                "Validate Card & Confirm Booking"
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-3 h-3" />
                <span>Secured by Stripe - PCI DSS Compliant</span>
              </div>
              <p>
                By confirming this booking, you agree to Ko Lake Villa's terms and conditions.
                Your payment method will be validated but not charged today.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function CardValidation() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get booking data from session storage or URL params
    const stored = sessionStorage.getItem('bookingData');
    let details;
    
    if (stored) {
      details = JSON.parse(stored);
      sessionStorage.removeItem('bookingData');
    } else {
      // Fallback to URL params
      const params = new URLSearchParams(window.location.search);
      const roomName = params.get('room') || 'Entire Villa Exclusive (KNP)';
      const checkIn = params.get('checkin') || new Date().toISOString().split('T')[0];
      const checkOut = params.get('checkout') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const guests = parseInt(params.get('guests') || '2');
      
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      
      details = {
        roomName,
        checkIn,
        checkOut,
        guests,
        nights
      };
    }
    
    setBookingDetails(details);

    // Create setup intent for card validation
    apiRequest("POST", "/api/create-setup-intent", { 
      booking: details 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Setup intent error:', error);
        toast({
          title: "Validation Setup Error",
          description: "Unable to initialize card validation. Please try again.",
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
          <p className="text-gray-600">Preparing card validation...</p>
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
            <h1 className="text-3xl font-bold text-[#8B5E3C]">Validate Payment Method</h1>
            <p className="text-gray-600">Ko Lake Villa - Secure Card Validation</p>
          </div>
        </div>

        {/* Card Validation Form */}
        <Elements stripe={stripePromise} options={options}>
          <CardValidationForm bookingDetails={bookingDetails} />
        </Elements>
      </div>
    </div>
  );
}