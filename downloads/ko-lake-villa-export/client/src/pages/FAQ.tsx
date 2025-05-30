import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    document.title = "FAQ - Ko Lake Villa, Ahangama, Galle";
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How do I get to Ko Lake Villa from Colombo Airport?",
      answer: "Ko Lake Villa is located in Ahangama, Galle, approximately 150km from Bandaranaike International Airport. The journey takes about 2.5-3 hours by car. We can arrange airport transfers, or you can take the highway (A1) south to Galle, then follow coastal road to Ahangama. Tuk-tuks and buses are also available for a more local experience."
    },
    {
      question: "What's included in the villa rental price?",
      answer: "Your stay includes full access to the villa, lake views, Wi-Fi, housekeeping, garden access, and basic amenities. Meals can be arranged separately with our local chef who specializes in authentic Sri Lankan cuisine and international dishes."
    },
    {
      question: "Is early check-in or late check-out available?",
      answer: "Standard check-in is 2:00 PM and check-out is 11:00 AM. Early check-in and late check-out may be available depending on occupancy. Please contact us in advance to arrange, and additional charges may apply."
    },
    {
      question: "Can you help arrange activities and excursions?",
      answer: "Absolutely! We can help arrange whale watching from Mirissa, visits to Galle Fort, surfing lessons, temple visits, spice garden tours, and many other authentic Sri Lankan experiences. Our local knowledge ensures you get the best experiences at fair prices."
    },
    {
      question: "Is Ko Lake Villa suitable for families with children?",
      answer: "Yes, our villa welcomes families. The lake setting is safe and beautiful for children to explore. We can provide additional bedding, help arrange family-friendly activities, and our staff can assist with any special requirements for young guests."
    },
    {
      question: "What's the best time to visit Ahangama and the Southern Coast?",
      answer: "The best weather is from December to March with calm seas and minimal rainfall. April-May and September-November are also pleasant. The monsoon season (May-September) brings rougher seas but fewer crowds and lush green landscapes."
    },
    {
      question: "Do you provide meals and what dietary restrictions can you accommodate?",
      answer: "We can arrange delicious Sri Lankan and international meals with advance notice. Our local chef accommodates vegetarian, vegan, gluten-free, and other dietary requirements. Fresh seafood, tropical fruits, and organic vegetables are specialties of the region."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Everything you need to know about your stay at Ko Lake Villa in Ahangama, Galle
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleItem(index)}
                  >
                    <CardTitle className="flex justify-between items-center text-lg text-gray-800">
                      <span>{faq.question}</span>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-blue-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  {openItems.includes(index) && (
                    <CardContent className="pt-0">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-6">
                We're here to help make your stay at Ko Lake Villa perfect. Get in touch with us directly.
              </p>
              <div className="space-x-4">
                <a 
                  href="/contact" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Us
                </a>
                <a 
                  href="https://wa.me/940711730345" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default FAQ;